const utilities = require('../utilities/')
const invModel = require('../models/inventory-model')
const Update = require('update')

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
    const inv_id = parseInt(req.params.inventory_id)
    const nav = await utilities.getNav()
    const inv_data = await invModel.getCarDetails(inv_id)
    const classificationSelect = await utilities.buildClassificationList(inv_data.rows[0].classification_id)
    res.render("inv/update-inventory", {
        title: "Update Inventory",
        nav,
        classificationSelect,
        errors: null,
        inv_id: inv_data.rows[0].inv_id,
        inv_make: inv_data.rows[0].inv_make,
        inv_model: inv_data.rows[0].inv_model,
        inv_year: inv_data.rows[0].inv_year,
        inv_description: inv_data.rows[0].inv_description,
        inv_image: inv_data.rows[0].inv_image,
        inv_thumbnail: inv_data.rows[0].inv_thumbnail,
        inv_price: inv_data.rows[0].inv_price,
        inv_miles: inv_data.rows[0].inv_miles,
        inv_color: inv_data.rows[0].inv_color,
        classification_name: inv_data.rows[0].classification_id
    })
}
async function updateInventory(req, res) {
    const inv_id = parseInt(req.params.inventory_id)
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList()
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    console.log('inv_id', inv_id)
    const invResult = await invModel.updateInventory(
        inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
    )
    if (invResult) {
        req.flash(
            "notice",
            `The ${inv_make} ${inv_model} was successfully updated.`
        )
        res.redirect("/inv/")
    } else {
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).render("inv/update-inventory", {
            title: "Update Inventory",
            nav,
            classificationSelect: await utilities.buildClassificationList(classification_id),
            errors: null,
            inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
        })
    }
}
module.exports = {
    buildManagement,
    buildAddClassification,
    buildAddInventory,
    addClassification,
    addInventory, 
    getInventoryJSON,
    buildUpdateInventory,
    updateInventory
}