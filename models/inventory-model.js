const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}
async function getClassificationName(classificationId){
    return await pool.query(`SELECT classification_name FROM public.classification WHERE classification_id=${classificationId}`)
}
async function getInventory(classificationId){
    return await pool.query(`SELECT * FROM public.inventory WHERE classification_id=${classificationId} ORDER BY inv_make`)
}
async function getCarDetails(inventoryId){
    return await pool.query(`SELECT * FROM public.inventory WHERE inv_id=${inventoryId}`)
}
async function addClassification(classificationName){
    try {
        const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
        return await pool.query(sql, [classificationName])
    } catch (error) {
        console.error("addClassification error " + error)
    }
}
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
    try {
        const sql = "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
        return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
    } catch (error) {
        console.error("addInventory error " + error)
    }
}
module.exports = {getClassifications, getClassificationName, getInventory, getCarDetails, addClassification, addInventory}