const utilities = require('../utilities/')
const invModel = require('../models/inventory-model')

async function buildManagement(req, res, next) {
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("inv/management", {
        title: "Management",
        nav,
        erros: null,
        classificationSelect
    })
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
    const result = await invModel.addClassification(classification_name)
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
    const invResult = await invModel.addInventory(
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
/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
async function getInventoryJSON (req, res, next) {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventory(classification_id)
    if (invData.rows) {
      return res.json(invData.rows)
    } else {
      next(new Error("No data returned"))
    }
  }
async function buildUpdateInventory(req, res, next) {
    inv_id = parseInt(req.params.inventory_id)
    const nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("inv/update-inventory", {
        title: "Update Inventory",
        nav,
        classificationSelect,
        errors: null,
    })
}
module.exports = {
    buildManagement,
    buildAddClassification,
    buildAddInventory,
    addClassification,
    addInventory, 
    getInventoryJSON,
    buildUpdateInventory
}