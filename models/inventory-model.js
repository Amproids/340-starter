const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

async function getClassificationName(classificationId){
    try {
        const sql = "SELECT classification_name FROM public.classification WHERE classification_id = $1"
        const data = await pool.query(sql, [classificationId])
        return data
    } catch (error) {
        console.error("getClassificationName error " + error)
    }
}

async function getInventory(classificationId){
    try {
        const sql = "SELECT * FROM public.inventory WHERE classification_id = $1 ORDER BY inv_make"
        const data = await pool.query(sql, [classificationId])
        return data
    } catch (error) {
        console.error("getInventory error " + error)
    }
}

async function getCarDetails(inventoryId){
    try {
        const sql = "SELECT * FROM public.inventory WHERE inv_id = $1"
        const data = await pool.query(sql, [inventoryId])
        return data
    } catch (error) {
        console.error("getCarDetails error " + error)
    }
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
      throw error
    }
  }
  
async function updateInventory(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
    try {
        const sql = `
            UPDATE inventory 
            SET inv_make = $1,
                inv_model = $2,
                inv_year = $3,
                inv_description = $4,
                inv_image = $5,
                inv_thumbnail = $6,
                inv_price = $7,
                inv_miles = $8,
                inv_color = $9,
                classification_id = $10
            WHERE inv_id = $11
            RETURNING *`
        const result = await pool.query(sql, [
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
            inv_id
        ])
        if (result.rowCount === 0) {
            throw new Error(`No inventory item found with ID ${inv_id}`)
        }
        return result
    } catch (error) {
        console.error("updateInventory error: " + error)
        throw error
    }
}
/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
    try {
        const sql = "DELETE FROM inventory WHERE inv_id = $1"
        const data = await pool.query(sql, [inv_id])
        return data.rowCount
    } catch (error) {
        console.error("Delete Inventory Error " + error)
        throw error
    }
}
module.exports = {
    getClassifications,
    getClassificationName,
    getInventory,
    getCarDetails,
    addClassification,
    addInventory,
    updateInventory,
    deleteInventoryItem
}