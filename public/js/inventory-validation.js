"use strict"

// Get all form elements
const form = document.querySelector("#addInventoryForm") || dosument.querySelector("#updateInventoryForm")
const make = document.querySelector("#invMake")
const model = document.querySelector("#invModel")
const year = document.querySelector("#invYear")
const description = document.querySelector("#invDescription")
const image = document.querySelector("#invImage")
const thumbnail = document.querySelector("#invThumbnail")
const price = document.querySelector("#invPrice")
const miles = document.querySelector("#invMiles")
const color = document.querySelector("#invColor")
const classification = document.querySelector("#classificationList")

// Validation function
function validateForm() {
    let valid = true
    
    // Validate make
    if (make.value.length < 3) {
        valid = false
        make.classList.add("invalid")
    } else {
        make.classList.remove("invalid")
    }

    // Validate model
    if (model.value.length < 3) {
        valid = false
        model.classList.add("invalid")
    } else {
        model.classList.remove("invalid")
    }

    // Validate year
    const currentYear = new Date().getFullYear()
    if (year.value < 1900 || year.value > currentYear + 1) {
        valid = false
        year.classList.add("invalid")
    } else {
        year.classList.remove("invalid")
    }

    // Validate description
    if (description.value.length < 10) {
        valid = false
        description.classList.add("invalid")
    } else {
        description.classList.remove("invalid")
    }

    // Validate price
    if (isNaN(price.value) || price.value <= 0) {
        valid = false
        price.classList.add("invalid")
    } else {
        price.classList.remove("invalid")
    }

    // Validate miles
    if (isNaN(miles.value) || miles.value < 0) {
        valid = false
        miles.classList.add("invalid")
    } else {
        miles.classList.remove("invalid")
    }

    // Validate color
    if (color.value.length < 1) {
        valid = false
        color.classList.add("invalid")
    } else {
        color.classList.remove("invalid")
    }

    // Validate classification
    if (classification.value === "") {
        valid = false
        classification.classList.add("invalid")
    } else {
        classification.classList.remove("invalid")
    }

    return valid
}

// Add event listener to form
form.addEventListener("submit", function(event) {
    if (!validateForm()) {
        event.preventDefault()
        alert("Please correct the errors in the form.")
    }
})