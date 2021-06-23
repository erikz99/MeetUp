function init() {
    var userRow = 
        '<div class="user-row">' +
            '<input type="text" name="email" class="email">' + 
            '<input type="text" name="userTime" class="userTime" disabled>' + 
            '<button type="button" class="add-btn">+</button>' + 
            '<button type="button" class="remove-btn">-</button>'
        '</div>';
    document.getElementById("schedule").innerHTML = userRow;

    buttonsInit(document.querySelector(".add-btn"), document.querySelector(".remove-btn"));
    document.getElementById("time").addEventListener("input", function () {
        if (validateScheduleInput()) {
            changeTime(document.getElementById("time").value);
        }
    });
    document.getElementById("meetInterval").addEventListener("input", function () {
        if (validateScheduleInput()) {
            changeTime(document.getElementById("time").value);
        }
    });
    document.getElementById("waitingInterval").addEventListener("input", function () {
        if (validateScheduleInput()) {
            changeTime(document.getElementById("time").value);
        }
    });

    document.getElementById("schedule_from").addEventListener("submit", function (event) {
    event.preventDefault();
        if (validateFormInput() && validateUsersInput()) {
            postForm();
            event.preventDefault();
        } else {
            event.preventDefault();
        }
    });
    document.getElementById("cancel_btn").addEventListener("click", function () {
        window.location.href = "panel.html";
    });
}

async function postForm() {
    const response = await fetch("endpoints/room.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: getFormData(),
    }).then(data => data.json());

    if (response.success) {
        window.location.href = "panel.html";
    } else {
        alert("Couldn't create room. Please try again");
    }
}

function getFormData () {
    var schedule = [];
    document.querySelectorAll(".user-row").forEach(element => {
        schedule.push(element.childNodes[0].value);
    });

    var data = {
        "name": document.getElementById("name").value,
        "waitingInterval": document.getElementById("waitingInterval").value,
        "meetInterval": document.getElementById("meetInterval").value,
        "start": document.getElementById("date").value + " " + document.getElementById("time").value,
        "schedule": schedule
    };

    return JSON.stringify(data);
}

function validateFormInput () {
    let name = document.getElementById("name");
    let date = document.getElementById("date");

    renderError(name);
    renderError(date);
    renderError(document.getElementById("time"));
    renderError(document.getElementById("meetInterval"));
    renderError(document.getElementById("waitingInterval"));

    return validateInput(name) && validateInput(date) && validateScheduleInput();
}

function validateScheduleInput () {
    let time = document.getElementById("time");
    let meetInterval = document.getElementById("meetInterval");
    let waitingInterval = document.getElementById("waitingInterval");

    return validateInput(time) && validateInput(meetInterval) && validateInput(waitingInterval);
}

function validateInput(element) {
    return (element.value && element.value.length);
}

function renderError(element) {
    if (!element.value || element.value.length == 0) {
        element.classList.add("input-error");
    } else {
        element.classList.remove("input-error");
    }
}

function validateUsersInput () {
    var isValid = true;
    document.querySelectorAll(".email").forEach(element => {
        isValid = validateInput(element);
        renderError(element);
    });

    return isValid;
}

function changeTime (timeString) {
    var time = timeString.split(":");
    var startTime = new Date();
    var meetTime = parseInt(document.getElementById("meetInterval").value);
    var waitTime = parseInt(document.getElementById("waitingInterval").value);
    startTime.setHours(time[0]);
    startTime.setMinutes(time[1]);

    document.querySelectorAll(".userTime").forEach(element => {
        let minutes = (startTime.getMinutes() < 10 ? "0" : "") + startTime.getMinutes();
        let hours = (startTime.getHours() < 10 ? "0" : "") + startTime.getHours();
        element.value = hours + ":" + minutes;
        startTime = addMinutes(startTime, (meetTime + waitTime));
    });
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}

function buttonsInit (addButton, removeButton) {
    var userRowHTML = 
        '<input type="text" name="email" class="email">' + 
        '<input type="text" name="userTime" class="userTime" disabled>' + 
        '<button type="button" class="add-btn">+</button>' + 
        '<button type="button" class="remove-btn">-</button>';

    removeButton.addEventListener("click", function () {
        if (document.getElementsByClassName("remove-btn").length > 1) {
            removeButton.parentNode.remove();
        }

        if (validateScheduleInput()) {
            changeTime(document.getElementById("time").value);
        }
    });

    addButton.addEventListener("click", function () {
        var rowNode = document.createElement("div");
        rowNode.classList.add("user-row");
        rowNode.innerHTML = userRowHTML;
        document.querySelector("#schedule").insertBefore(rowNode, addButton.parentNode.nextSibling);

        buttonsInit(rowNode.childNodes[2], rowNode.childNodes[3]);

        if (validateScheduleInput()) {
            changeTime(document.getElementById("time").value);
        }
    });
}

init();