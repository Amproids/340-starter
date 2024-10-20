const utilities = require('.')
const { body, validationResult } = require("express-validator")
const validate = {}
const inventoryModel = require("../models/inventory-model")

/*  **********************************
*  Classification Data Validation Rules
* ********************************* */
validate.classificationRules = () => {
    return [
        body("classification_name")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Please provide a classification name.")
        .custom(value => !/\s/.test(value))
        .withMessage("No spaces allowed in classification name."),
    ]
}
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inv/add-classification", {
            title: "Add Classification",
            nav,
            classification_name
        })
        return
    }
    next()
}
validate.inventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Please provide a make name."),

        body("inv_model")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Please provide a model name."),

        body("inv_year")
            .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
            .withMessage("Please provide a valid year."),

        body("inv_description")
            .trim()
            .isLength({ min: 10 })
            .withMessage("Please provide a description."),

        body("inv_image")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide an image path."),

        body("inv_thumbnail")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a thumbnail path."),

        body("inv_price")
            .isFloat({ min: 0 })
            .withMessage("Please provide a valid price."),

        body("inv_miles")
            .isInt({ min: 0 })
            .withMessage("Please provide a valid mileage."),

        body("inv_color")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a color."),

        body("classification_id")
            .isInt({ min: 1 })
            .withMessage("Please choose a classification.")
    ]
}

validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationSelect = await utilities.buildClassificationList(classification_id)
        res.render("inv/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            classificationSelect,
            inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
        })
        return
    }
    next()
}
module.exports = validate