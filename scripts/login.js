function init() {
    if (document.getElementById("login_form")) {
        document.getElementById("login_form").addEventListener("submit", function (event) {
            event.preventDefault();

            if (validateEmptyFields()) {
                postForm('login');
            } else {
                event.preventDefault();
            }
        });
    }

    if (document.getElementById("register-techer-btn")) {
        document.getElementById("register-techer-btn").addEventListener("click", function () {
            redirect("register_teacher");
        });
    }

    if (document.getElementById("register-student-btn")) {
        document.getElementById("register-student-btn").addEventListener("click", function () {
            redirect("register_student");
        });
    }

    if (document.getElementById("register_student_form")) {
        document.getElementById("register_student_form").addEventListener("submit", function (event) {
            event.preventDefault();

            if (validateEmptyFields() && validateInput()) {
                postForm('register', 1);
            } else {
                event.preventDefault();
            }
        });
    }

    if (document.getElementById("register_teacher_form")) {
        document.getElementById("register_teacher_form").addEventListener("submit", function (event) {
            event.preventDefault();

            if (validateEmptyFields() && validateInput()) {
                postForm('register', 2);
            } else {
                event.preventDefault();
            }
        });
    }
};

async function postForm (formType, userTypeId = 0) {
    const data = getFormDataJSON(userTypeId);
    const url = formType == "register" ? "endpoints/user.php" :
        "endpoints/session.php";
    const responseJSON = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data,
    }).then(data => data.json());
    var response = responseJSON.success;

    if (!response) {
        if (!document.getElementById("error_validation")) {
            let inputs = document.getElementsByTagName("input");
            let lastInput = inputs[inputs.length - 1];
            let error = document.createElement("small");

            error.classList.add("error_field");
            error.setAttribute("id", "error_validation");
            error.textContent = "Невалидни входни данни";
            lastInput.parentNode.insertBefore(error, lastInput.nextSibling);
        }
    } else {
        window.location.href = formType == "register" ? "register_success.html" : "panel.html";
    }
    
}

function validateInput () {
    let inputs = document.getElementsByTagName("input");
    let isValid = true;

    for (const input of inputs) {
       if (document.getElementById("error_" + input.id)) {
            if (input.name == "email" && !isValidEmail(input.value)) {
                document.getElementById("error_" + input.id).textContent = "Невалиден имейл";
                isValid = false;
                continue;
            } else if (input.name == "password" && !isValidPassword(input.value)) {
                document.getElementById("error_" + input.id).textContent = "Невалидена парола";
                isValid = false;
                continue;
            }

            document.getElementById("error_" + input.id).remove();
        } else if (input.name == "email" && !isValidEmail(input.value)) {
            addError(input, "Невалиден имейл");
            isValid = false;
        } else if (input.name == "password" && !isValidPassword(input.value)) {
            addError(input, "Невалидена парола");
            isValid = false;
        }
    }

    return isValid;
}

function validateEmptyFields() {
    let inputs = document.getElementsByTagName("input");
    let isValid = true;

    for (const input of inputs) {
        if (input.value == "") {
            if (!document.getElementById("error_" + input.id)) {
                addError(input, "Полето е задължително");
            }

            isValid = false;
        } else if (document.getElementById("error_" + input.id)) {
            document.getElementById("error_" + input.id).remove();
        }
    }

    return isValid;
}

function addError(input, errorMessage) {
    let error = document.createElement("small");
    error.classList.add("error_field");
    error.setAttribute("id", "error_" + input.id);
    error.textContent = errorMessage;
    input.parentNode.insertBefore(error, input.nextSibling);
}

function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function isValidPassword(password) {
    const re = /[a-zA-Z]/;
    return password.length > 5 && re.test(password);
}

function getFormDataJSON (userTypeId) {
    let inputs = document.getElementsByTagName("input");
    let name = "";
    data = {};
    data["userTypeId"] = userTypeId;

    for (const input of inputs) {
        if (input.name == "first_name") {
            name += input.value;
            continue;
        } else if (input.name == "last_name") {
            name += " " + input.value;
            data["name"] = name;
            continue;
        }

        data[input.name] = input.value;
    }

    return JSON.stringify(data);
}

function redirect (page) {
    window.location.href = window.location.href.replace("register", page);
}

init();