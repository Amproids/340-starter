const invModel = require("../models/inventory-model")
const favoritesModel = require("../models/favorites-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 * ************************ */
// utilities/index.js - Updated getNav function
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    
    // Add classifications
    data.rows.forEach((row) => {
        list += '<li>'
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' + 
            row.classification_name +
            '</a>'
        list += '</li>'
    })
    list += '<li><a href="/favorites" title="View your favorite vehicles">Favorites</a></li>'
    list += '</ul>'
    return list
}

Util.getInv = async function (classificationId, res) {
    try {
        const data = await invModel.getInventory(classificationId)
        const classification = await invModel.getClassificationName(classificationId)
        
        // Check if we have valid classification data
        if (!classification?.rows?.[0]?.classification_name) {
            throw new Error("Classification not found")
        }

        // Add null check for res.locals
        const account_id = res?.locals?.accountData?.account_id || null
        
        let inventoryHTML = `<h1>${classification.rows[0].classification_name}</h1><ul>`
        
        // Check if we have valid inventory data
        if (data?.rows?.length > 0) {
            // Use for...of instead of forEach for async operations
            for (const vehicle of data.rows) {
                let favoriteButton = ''
                if (typeof Util.buildFavoriteButton === 'function') {
                    favoriteButton = await Util.buildFavoriteButton(vehicle.inv_id, account_id)
                }

                inventoryHTML += '<li>'
                inventoryHTML += `<a href='/inv/details/${vehicle.inv_id}'>`
                inventoryHTML += `<img src='${vehicle.inv_thumbnail}' 
                    alt='${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}'><br><hr>`
                inventoryHTML += `<p>${vehicle.inv_make} ${vehicle.inv_model}<br>`
                inventoryHTML += `$${new Intl.NumberFormat().format(vehicle.inv_price)}</p>`
                inventoryHTML += '</a>'
                
                if (favoriteButton) {
                    inventoryHTML += `<div class="favorite-container">`
                    inventoryHTML += favoriteButton
                    inventoryHTML += `</div>`
                }
                
                inventoryHTML += '</li>'
            }
        } else {
            inventoryHTML += '<li class="notice">No vehicles found.</li>'
        }
        
        inventoryHTML += '</ul>'
        return inventoryHTML
    } catch (error) {
        console.error("getInv error: ", error)
        return `<p class="notice">Sorry, there was an error processing your request. Please try again.</p>`
    }
}
Util.getCarDetails = async function (inventoryId, req, res, next) {
    let data = await invModel.getCarDetails(inventoryId)
    let row = data.rows[0]
    let detailsHTML = `<div>`
    detailsHTML += `<h1>${row.inv_year} ${row.inv_make} ${row.inv_model}</h1>`
    detailsHTML += `<img src='${row.inv_image}' alt='Image of ${row.inv_make} ${row.inv_model}'><br><hr></div>`
    detailsHTML += `<div><h2>${row.inv_make} ${row.inv_model} Details</h2>`
    detailsHTML += `<p><b>Price:</b> $${formatNumber(row.inv_price)}</p>`
    detailsHTML += `<p><b>Color:</b> ${row.inv_color}</p>`
    detailsHTML += `<p><b>Mileage:</b> ${formatNumber(row.inv_miles)} miles</p>`
    detailsHTML += `<p><b>Description:</b> ${row.inv_description}</p></div>`
    return detailsHTML
}

/* ****************************************
 * Builds the Add Classification Select HTML
 * **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
  }

//I didn't know where else to put this function defenition
function formatNumber(number) {
    let numberString = number.toString()
    for (let i = 0; i < numberString.length; i++) {
    }
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
    if (req.cookies.jwt) {
        jwt.verify(
        req.cookies.jwt,
        process.env.ACCESS_TOKEN_SECRET,
        function (err, accountData) {
            if (err) {
                req.flash("Please log in")
                res.clearCookie("jwt")
                return res.redirect("/account/login")
            }
            res.locals.accountData = accountData
            res.locals.loggedin = 1
            next()
        })
    } else {
        next()
    }
}
/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
    console.log(res.locals.loggedin)
    if (res.locals.loggedin) {
        next()

    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}
/* ****************************************
 * Middleware to check for Employee or Admin roles
 **************************************** */
Util.checkAdminEmployee = (req, res, next) => {
    if (res.locals.loggedin) {
        const accessLevel = res.locals.accountData.account_type
        if (accessLevel === "Admin" || accessLevel === "Employee"){
            next()
        } else {
            req.flash("notice", "You do not have permission to access this page.")
            return res.redirect("/account/login")
        }
    } else {
        req.flash("notice", "Please log in.")
        return res.redirect("/account/login")
    }
}
/* ************************
 * Build the favorites button HTML
 * *********************** */
Util.buildFavoriteButton = async function(inv_id, account_id = null) {
    if (!account_id) {
        return `
            <button 
                class="favorite-btn" 
                data-inv-id="${inv_id}" 
                data-action="login"
                title="Login to favorite this vehicle">
                ♡ Favorite
            </button>
        `
    }
    
    try {
        console.log("Building the favorites button")
        const isFavorited = await favoritesModel.checkFavorite(account_id, inv_id)
        const buttonClass = isFavorited ? 'favorite-btn favorited' : 'favorite-btn'
        const action = isFavorited ? 'remove' : 'add'
        const text = isFavorited ? '♥ Favorited' : '♡ Favorite'
        
        return `
            <button 
                class="${buttonClass}" 
                data-inv-id="${inv_id}" 
                data-action="${action}"
                title="${isFavorited ? 'Remove from favorites' : 'Add to favorites'}">
                ${text}
            </button>
        `
    } catch (error) {
        console.error("Error building favorite button:", error)
        return ''
    }
}
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util