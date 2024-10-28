// Get the form elements
const accountForm = document.querySelector("#updateAccountForm")
const passwordForm = document.querySelector("#updatePasswordForm")

// Account form validation
accountForm.addEventListener("submit", function(event) {
    let valid = true
    
    // First name validation
    const firstName = document.querySelector("#account_firstname")
    if(firstName.value.length < 1) {
        valid = false
        firstName.classList.add("invalid")
    }
    
    // Last name validation
    const lastName = document.querySelector("#account_lastname")
    if(lastName.value.length < 1) {
        valid = false
        lastName.classList.add("invalid")
    }
    
    // Email validation
    const email = document.querySelector("#account_email")
    const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if(!emailPattern.test(email.value)) {
        valid = false
        email.classList.add("invalid")
    }
    
    if (!valid) {
        event.preventDefault()
        alert("Please check your entries and try again.")
    }
})
// Password form validation
passwordForm.addEventListener("submit", function(event) {
    const password = document.querySelector("#account_password")
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/
    
    if(!passwordPattern.test(password.value)) {
        event.preventDefault()
        password.classList.add("invalid")
        alert("Please check that your password meets all requirements.")
    }
})