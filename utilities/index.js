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
    let classification = await invModel.getClassificationName(classificationId)
    let inventoryHTML = `<h1>${classification.rows[0].classification_name}</h1><ul>`
    data.rows.forEach((row) => {
        inventoryHTML += `<li><a href='/inv/details/${row.inv_id}'>`
        inventoryHTML += `<img src='${row.inv_thumbnail}' alt='${row.inv_year} ${row.inv_make} ${row.inv_model}'><br><hr>`
        inventoryHTML += `<p>${row.inv_make} ${row.inv_model}<br>`
        inventoryHTML += `$${formatNumber(row.inv_price)}</p>`
        inventoryHTML += '</a></li>' 
    })
    inventoryHTML += '</ul>'
    return inventoryHTML
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