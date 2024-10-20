const utilities = require('../utilities/')
const inventoryModel = require('../models/inventory-model')

async function buildManagement(req, res, next) {
    const nav = await utilities.getNav()
    res.render("inv/management", {title: "Management", nav})
}
async function buildAddClassification(req, res, next) {
    const nav = await utilities.getNav()
    res.render("inv/add-classification", {title: "Add Classification", nav})
}
async function buildAddInventory(req, res, next) {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("inv/add-inventory", {
        title: "Add Inventory",
        nav,
        classificationSelect,
        errors: null,
    })
}

async function addClassification(req, res) {
    const nav = await utilities.getNav()
    const { classification_name } = req.body
    const result = await inventoryModel.addClassification(classification_name)
    if (result) {
        req.flash("notice", "Classification added successfully!")
        res.redirect("/inv/")
    } else {
        req.flash("notice", "Failed to add classification.")
        res.status(500).render("inv/add-classification", { title: "Add Classification", nav })
    }
}
async function addInventory(req, res) {
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList()
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    const invResult = await inventoryModel.addInventory(
        inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    )
    if (invResult) {
        req.flash(
            "notice",
            `The ${inv_make} ${inv_model} was successfully added.`
        )
        res.redirect("/inv/")
    } else {
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).render("inv/add-inventory", {
            title: "Add Inventory",
            nav,
            classificationSelect: await utilities.buildClassificationList(classification_id),
            errors: null,
            inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
        })
    }
}
module.exports = { buildManagement, buildAddClassification, buildAddInventory, addClassification, addInventory }