const express = require('express');
const router = express.Router();
const utilities = require("../utilities/")
const inventoryController = require("../controllers/inventoryController")
const regValidate = require('../utilities/inventory-validation')

//Magagement Route
router.get(
    "/",
    utilities.checkLogin,
    utilities.checkAdminEmployee,
    utilities.handleErrors(inventoryController.buildManagement)
)
//Classification Routes
router.get(
    "/add-classification",
    utilities.checkLogin,
    utilities.checkAdminEmployee,
    utilities.handleErrors(inventoryController.buildAddClassification)
)
router.post(
    "/add-classification",
    utilities.checkLogin,
    utilities.checkAdminEmployee,
    regValidate.classificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(inventoryController.addClassification)
)
//Inventory Routes
router.get(
    "/add-inventory",
    utilities.checkLogin,
    utilities.checkAdminEmployee,
    utilities.handleErrors(inventoryController.buildAddInventory)
)
router.post(
    "/add-inventory",
    utilities.checkLogin,
    utilities.checkAdminEmployee,
    regValidate.inventoryRules(),
    regValidate.checkInventoryData,
    utilities.handleErrors(inventoryController.addInventory)
)
router.get(
    "/getInventory/:classification_id",
    utilities.checkLogin,
    utilities.checkAdminEmployee,
    utilities.handleErrors(inventoryController.getInventoryJSON)
)
//Update Inventory Route
router.get(
    "/update/:inventory_id",
    utilities.checkLogin,
    utilities.checkAdminEmployee,
    utilities.handleErrors(inventoryController.buildUpdateInventory)
)
router.post(
    "/update/:inventory_id",
    utilities.checkLogin,
    utilities.checkAdminEmployee,
    regValidate.inventoryRules(),
    regValidate.checkInventoryData,
    utilities.handleErrors(inventoryController.updateInventory)
)
// Route to build delete confirmation view
router.get(
    "/delete/:inventory_id",
    utilities.checkLogin,
    utilities.checkAdminEmployee,
    utilities.handleErrors(inventoryController.buildDeleteConfirmation)
)

// Route to handle the delete post request
router.post(
    "/delete/:inventory_id",
    utilities.checkLogin,
    utilities.checkAdminEmployee,
    utilities.handleErrors(inventoryController.deleteInventoryItem)
)
module.exports = router;