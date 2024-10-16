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
        inventoryHTML += `<li><a href='/inv/details/${row.inv_id}'>`
        inventoryHTML += `<img src='${row.inv_thumbnail}' alt='${row.inv_description}'><br><hr>`
        inventoryHTML += `<p>${row.inv_make} ${row.inv_model}<br>`
        inventoryHTML += `$${formatNumber(row.inv_price)}</p>`
        inventoryHTML += '</a></li>' 
    })
    inventoryHTML += '</ul>'
    return inventoryHTML
}
Util.getCarDetails = async function (inventoryId, req, res, next) {
    let data = await invModel.getCarDetails(inventoryId)
    let detailsHTML = `<h1>${data.rows[0].inv_year} ${data.rows[0].inv_make} ${data.rows[0].inv_model}</h1>`
    detailsHTML += `<img src='${data.rows[0].inv_image}' alt='${data.rows[0].inv_description}'><br><hr>`
    detailsHTML += `<h2>${data.rows[0].inv_make} ${data.rows[0].inv_model} Details</h2>`
    detailsHTML += `<p><b>Price:</b> $${formatNumber(data.rows[0].inv_price)}</p>`
    detailsHTML += `<p><b>Color:</b> ${data.rows[0].inv_color}</p>`
    detailsHTML += `<p><b>Mileage:</b> ${formatNumber(data.rows[0].inv_miles)} miles</p>`
    detailsHTML += `<p><b>Description:</b> ${data.rows[0].inv_description}</p>`
    return detailsHTML
}

//I didn't know where else to put this function defenition
function formatNumber(number) {
    let numberString = number.toString()
    for (let i = 0; i < numberString.length; i++) {
    }
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util