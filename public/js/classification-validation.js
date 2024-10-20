// Get the form element
const form = document.querySelector("#addClassificationForm")
const classificationName = document.querySelector("#classificationName")

// Validation function
function validateForm() {
    let valid = true
    
    // Validate classification name
    if (classificationName.value.trim().length < 1) {
        valid = false
        classificationName.classList.add("invalid")
    } else if (/\s/.test(classificationName.value) || /[^a-zA-Z0-9]/.test(classificationName.value)) {
        valid = false
        classificationName.classList.add("invalid")
    } else {
        classificationName.classList.remove("invalid")
    }

    return valid
}

// Add event listener to form
form.addEventListener("submit", function(event) {
    if (!validateForm()) {
        event.preventDefault()
        alert("Please correct the errors in the form. Classification name cannot be empty and must not contain spaces or special characters.")
    }
})