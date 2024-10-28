const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav()
    res.render("index", {title: "Home", nav})
}
baseController.buildInventory = async function(req, res){
    const classificationId = req.params.classificationId  // Get classification ID from URL
    const nav = await utilities.getNav()
    const inv = await utilities.getInv(classificationId)
    res.render("inventory", {title: "Inventory", nav, inv})
}
baseController.buildCarDetails = async function(req, res){
    const inventoryId = req.params.inventoryId  // Get classification ID from URL
    const nav = await utilities.getNav()
    const details = await utilities.getCarDetails(inventoryId)
    res.render("details", {title: "Details", nav, details})
}
baseController.triggerError = async function(req, res, next) {
    throw new Error("Intentional 500 Error");
  }

module.exports = baseController