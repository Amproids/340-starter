const express = require('express');
const router = express.Router();
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

router.get('/', utilities.checkLogin, utilities.handleErrors(accountController.buildAccount))
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post(
    '/register',
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)
//Process login attempt
router.post(
    '/login',
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)
router.get("/update/:account_id", 
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountUpdate)
)

router.post("/update/",
    utilities.checkLogin,
    regValidate.updateAccountRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
)

router.post("/update/password",
    utilities.checkLogin,
    regValidate.passwordRules(),
    regValidate.checkPasswordData,
    utilities.handleErrors(accountController.updatePassword)
)
router.get("/logout", utilities.handleErrors(accountController.logoutAccount))

module.exports = router;