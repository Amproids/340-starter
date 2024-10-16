const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

async function getInventory(classificationId){
    return await pool.query(`SELECT * FROM public.inventory WHERE classification_id=${classificationId} ORDER BY inv_make`)
}
async function getCarDetails(inventoryId){
    return await pool.query(`SELECT * FROM public.inventory WHERE inv_id=${inventoryId}`)
}
module.exports = {getClassifications, getInventory, getCarDetails}