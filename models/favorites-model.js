const pool = require("../database/")

const favoritesModel = {}

/* ***************************
 *  Get all favorites for a specific account
 * ************************** */
favoritesModel.getAccountFavorites = async function (account_id) {
    try {
        const sql = `
            SELECT f.*, 
                   i.inv_make, i.inv_model, i.inv_year, i.inv_price,
                   i.inv_thumbnail
            FROM favorites f
            JOIN inventory i 
            ON f.inv_id = i.inv_id
            WHERE f.account_id = $1
            ORDER BY f.favorite_date DESC`
        const data = await pool.query(sql, [account_id])
        return data.rows
    } catch (error) {
        console.error("getAccountFavorites error " + error)
        throw { status: 500, message: "Failed to get favorites" }
    }
}

/* ***************************
 *  Add a new favorite
 * ************************** */
favoritesModel.addFavorite = async function (account_id, inv_id) {
    try {
        const sql = `
            INSERT INTO favorites (account_id, inv_id)
            VALUES ($1, $2)
            RETURNING *`
        const data = await pool.query(sql, [account_id, inv_id])
        return data.rows[0]
    } catch (error) {
        if (error.code === '23505') { // Unique violation error code
            throw { status: 409, message: "Vehicle already in favorites" }
        }
        console.error("addFavorite error " + error)
        throw { status: 500, message: "Failed to add favorite" }
    }
}

/* ***************************
 *  Remove a favorite
 * ************************** */
favoritesModel.removeFavorite = async function (account_id, inv_id) {
    try {
        const sql = `
            DELETE FROM favorites 
            WHERE account_id = $1 AND inv_id = $2
            RETURNING *`
        const data = await pool.query(sql, [account_id, inv_id])
        return data.rows[0]
    } catch (error) {
        console.error("removeFavorite error " + error)
        throw { status: 500, message: "Failed to remove favorite" }
    }
}

/* ***************************
 *  Check if vehicle is favorited
 * ************************** */
favoritesModel.checkFavorite = async function (account_id, inv_id) {
    try {
        const sql = `
            SELECT EXISTS(
                SELECT 1 
                FROM favorites 
                WHERE account_id = $1 AND inv_id = $2
            ) as favorited`
        const data = await pool.query(sql, [account_id, inv_id])
        return data.rows[0].favorited
    } catch (error) {
        console.error("checkFavorite error " + error)
        throw { status: 500, message: "Failed to check favorite status" }
    }
}

/* ***************************
 *  Get favorite count for a vehicle
 * ************************** */
favoritesModel.getFavoriteCount = async function (inv_id) {
    try {
        const sql = `
            SELECT COUNT(*) as count 
            FROM favorites 
            WHERE inv_id = $1`
        const data = await pool.query(sql, [inv_id])
        return parseInt(data.rows[0].count)
    } catch (error) {
        console.error("getFavoriteCount error " + error)
        throw { status: 500, message: "Failed to get favorite count" }
    }
}

module.exports = favoritesModel