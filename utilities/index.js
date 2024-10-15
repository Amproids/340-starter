const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 * ************************ */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
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
    list += '</ul>'
    return list
}
Util.getInv = async function (classificationId, req, res, next) {
    let data = await invModel.getInventory(classificationId)
    let inventoryHTML = `<ul>`
    data.rows.forEach((row) => {
        inventoryHTML += `<li><a href='/inv/type/${classificationId}'>`
        inventoryHTML += `<img src='${row.inv_thumbnail}' alt='${row.inv_description}'><br><hr>`
        inventoryHTML += `<p>${row.inv_make} ${row.inv_model}<br>`
        inventoryHTML += `${formatPrice(row.inv_price)}</p>`
        inventoryHTML += '</a></li>' 
    })
    inventoryHTML += '</ul>'
    return inventoryHTML
}

//I didn't know where else to put this function defenition
function formatPrice(price) {
    let priceString = price.toString()
    for (let i = 0; i < priceString.length; i++) {
    }
    return '$' + priceString.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util