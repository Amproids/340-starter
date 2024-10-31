const express = require('express')
const router = express.Router()
const favoritesController = require("../controllers/favoritesController")
const utilities = require("../utilities")
const validate = require("../utilities/favorites-validation")
const rateLimit = require('express-rate-limit')

// Apply rate limiting
router.use(rateLimit(validate.rateLimiter))

// Route to build favorites view (protected)
router.get("/",
    utilities.checkLogin,
    utilities.handleErrors(favoritesController.buildFavorites)
)

// Route to check favorite status
router.get("/status/:inv_id",
    validate.favoriteRules(),
    validate.checkFavoriteData,
    utilities.handleErrors(favoritesController.checkFavoriteStatus)
)

// Route to add favorite (protected)
router.post("/add/:inv_id",
    utilities.checkLogin,
    validate.favoriteRules(),
    validate.checkFavoriteData,
    favoritesController.processAddFavorite,
    utilities.handleErrors(favoritesController.addFavorite)
)

// Route to remove favorite (protected)
router.delete("/remove/:inv_id",
    utilities.checkLogin,
    validate.favoriteRules(),
    validate.checkFavoriteData,
    validate.checkOwnership,
    utilities.handleErrors(favoritesController.removeFavorite)
)

// Error handler for this router
router.use(validate.handleFavoriteErrors)

module.exports = router