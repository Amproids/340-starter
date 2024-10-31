const favoritesModel = require("../models/favorites-model")
const utilities = require("../utilities")
const jwt = require("jsonwebtoken")

const favoritesController = {}

/* ****************************************
*  Deliver favorites view
* *************************************** */
favoritesController.buildFavorites = async function (req, res) {
    const account_id = parseInt(res.locals.accountData.account_id)
    try {
        const favorites = await favoritesModel.getAccountFavorites(account_id)
        const nav = await utilities.getNav()
        res.render("favorites/favorite", {
            title: "Your Favorites",
            nav,
            favorites,
            errors: null,
        })
    } catch (error) {
        req.flash("notice", error.message)
        res.redirect("/account/")
    }
}

/* ****************************************
*  Process Add Favorite
* *************************************** */
favoritesController.addFavorite = async function (req, res) {
    const account_id = parseInt(res.locals.accountData.account_id)
    const inv_id = parseInt(req.params.inv_id)

    if (!account_id || !inv_id) {
        return res.status(400).json({
            status: 400,
            message: "Bad Request. Invalid data provided."
        })
    }

    try {
        const result = await favoritesModel.addFavorite(account_id, inv_id)
        res.status(201).json({
            status: 201,
            message: "Favorite added successfully",
            data: result
        })
    } catch (error) {
        res.status(error.status || 500).json({
            status: error.status || 500,
            message: error.message
        })
    }
}

/* ****************************************
*  Process Remove Favorite
* *************************************** */
favoritesController.removeFavorite = async function (req, res) {
    const account_id = parseInt(res.locals.accountData.account_id)
    const inv_id = parseInt(req.params.inv_id)

    if (!account_id || !inv_id) {
        return res.status(400).json({
            status: 400,
            message: "Bad Request. Invalid data provided."
        })
    }

    try {
        const result = await favoritesModel.removeFavorite(account_id, inv_id)
        if (!result) {
            return res.status(404).json({
                status: 404,
                message: "Favorite not found"
            })
        }
        res.json({
            status: 200,
            message: "Favorite removed successfully",
            data: result
        })
    } catch (error) {
        res.status(error.status || 500).json({
            status: error.status || 500,
            message: error.message
        })
    }
}

/* ****************************************
*  Check Favorite Status
* *************************************** */
favoritesController.checkFavoriteStatus = async function (req, res) {
    const account_id = parseInt(res.locals.accountData?.account_id)
    const inv_id = parseInt(req.params.inv_id)

    if (!account_id) {
        return res.json({
            favorited: false,
            authenticated: false
        })
    }

    try {
        const favorited = await favoritesModel.checkFavorite(account_id, inv_id)
        res.json({
            favorited,
            authenticated: true
        })
    } catch (error) {
        res.status(error.status || 500).json({
            status: error.status || 500,
            message: error.message
        })
    }
}

/* ****************************************
*  Process Add Favorite with Authorization Check
* *************************************** */
favoritesController.processAddFavorite = async function (req, res, next) {
    if (!res.locals.accountData) {
        req.flash("notice", "Please log in to add favorites")
        return res.redirect("/account/login")
    }
    next()
}

module.exports = favoritesController