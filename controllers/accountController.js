const utilities = require('../utilities/')
const accountModel = require('../models/account-model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    return
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered, ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            if(process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
        return res.redirect("/account/")
        }
        else {
            req.flash("message notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
}
async function buildAccount(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/", {
        title: "Account Management",
        nav,
        errors: null,
    })
}
/* ****************************************
*  Deliver account update view
**************************************** */
async function buildAccountUpdate(req, res, next) {
    const account_id = parseInt(req.params.account_id)
    const accountData = await accountModel.getAccountById(account_id)
    let nav = await utilities.getNav()
    res.render("account/update", {
        title: "Edit Account",
        nav,
        errors: null,
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
    })
}

/* ****************************************
*  Process Account Update
**************************************** */
/* ****************************************
*  Process Account Update
**************************************** */
async function updateAccount(req, res, next) {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    const updateResult = await accountModel.updateAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_id
    )

    if (updateResult) {
        // Get the updated account data
        const accountData = await accountModel.getAccountById(account_id)
        
        // Delete sensitive info
        delete accountData.account_password
        
        // Create new JWT with updated data
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
        
        // Set the new token as a cookie
        if(process.env.NODE_ENV === 'development') {
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        } else {
            res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
        }

        req.flash("notice", "Account updated successfully.")
        res.redirect("/account/")
    } else {
        req.flash("notice", "Update failed. Please try again.")
        res.status(501).render("account/update", {
            title: "Edit Account",
            nav: await utilities.getNav(),
            errors: null,
            account_firstname,
            account_lastname,
            account_email,
        })
    }
}

/* ****************************************
*  Process Password Update
**************************************** */
async function updatePassword(req, res, next) {
    const { account_password, account_id } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", "Sorry, there was an error processing the password update.")
        res.status(500).render("account/update", {
            title: "Edit Account",
            nav,
            errors: null,
        })
        return
    }

    const updateResult = await accountModel.updatePassword(hashedPassword, account_id)

    if (updateResult) {
        req.flash("notice", "Password updated successfully.")
        res.redirect("/account/")
    } else {
        req.flash("notice", "Password update failed. Please try again.")
        res.status(501).render("account/update", {
            title: "Edit Account",
            nav,
            errors: null,
        })
    }
}
/* ****************************************
*  Process logout request
* *************************************** */
async function logoutAccount(req, res, next) {
    res.clearCookie("jwt")
    res.redirect("/")
}
// Don't forget to add this to your module.exports
module.exports = {
    buildLogin,
    buildRegister,
    registerAccount,
    accountLogin,
    buildAccount,
    logoutAccount,
    buildAccountUpdate,
    updateAccount,
    updatePassword
}