const { body, param, validationResult } = require("express-validator")
const favoritesModel = require("../models/favorites-model")
const invModel = require("../models/inventory-model") // Add this import
const validate = {}

/* ******************************
 * Validate favorite parameters
 * ***************************** */
validate.favoriteRules = () => {
    return [
        param("inv_id")
            .trim()
            .isInt()
            .withMessage("Invalid vehicle ID format")
            .custom(async (inv_id) => {
                try {
                    // Check if inventory item exists
                    const inventory = await invModel.getCarDetails(inv_id)
                    if (!inventory || !inventory.rows || !inventory.rows.length) {
                        throw new Error("Vehicle does not exist")
                    }
                    return true
                } catch (error) {
                    throw new Error("Error validating vehicle: " + error.message)
                }
            }),
    ]
}

/* ******************************
 * Check data and handle errors
 * ***************************** */
validate.checkFavoriteData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 400,
            message: errors.array()[0].msg,
        })
    }
    next()
}

/* ******************************
 * Validate user ownership
 * ***************************** */
validate.checkOwnership = async (req, res, next) => {
    const account_id = res.locals.accountData?.account_id
    const inv_id = parseInt(req.params.inv_id)

    try {
        const isFavorited = await favoritesModel.checkFavorite(account_id, inv_id)
        if (!isFavorited) {
            return res.status(404).json({
                status: 404,
                message: "Favorite not found"
            })
        }
        next()
    } catch (error) {
        next(error)
    }
}

/* ******************************
 * Custom error handler
 * ***************************** */
validate.handleFavoriteErrors = (err, req, res, next) => {
    console.error('Favorite Error:', err)
    
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 400,
            message: err.message
        })
    }
    
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            status: 401,
            message: "Authentication required"
        })
    }
    
    if (err.code === '23505') { // Duplicate favorite
        return res.status(409).json({
            status: 409,
            message: "Vehicle is already in favorites"
        })
    }
    
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || "Internal server error"
    })
}

module.exports = validate