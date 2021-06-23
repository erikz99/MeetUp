window.onload = async function() {
    var userType = await getUserType();

    document.getElementById("profile_icon").addEventListener("click", function () {
        if (userType) {
            window.location.href = "panel.html";
        } else {
            window.location.href = "login.html";
        }
    })
    
    if(document.getElementById("nav_panel")) {
        initNav(userType);
    }

    if (document.getElementById("events")) {
        loadEvents(userType);
    } else if (document.getElementById("profile")) {
        loadUserInfo(userType);
    }

    if (window.location.href.includes("queue.html")) {
        initQueuePage(userType);
    }
}

function initNav(userType) {
    document.getElementById("nav_panel").addEventListener("click", function () {
        window.location.href = "panel.html";
    });
    document.getElementById("nav_profile").addEventListener("click", function () {
        window.location.href = "profile.html";
    });
    document.getElementById("nav_exit").addEventListener("click", function () {
        logout();
    });

    if (userType === 2) {
        addCreateEventButton();
        document.getElementById("nav_new_room").addEventListener("click", function () {
            window.location.href = "add_room.html";
        });
    }
}

async function initQueuePage(userType) {
    var utlParam = window.location.href.split("?")[1];
    var roomId = utlParam.substring(utlParam.indexOf('=') + 1);
    var roomData = await getRoomData(roomId, userType);

    renderScheduleTable(roomId);
    document.getElementById("room_name").textContent = roomData['name'];

    document.getElementById("comment_form").addEventListener("submit", function(event) {
        event.preventDefault();
        addComment(roomId);
    });

    if (userType === 1) {
        enterQueue(roomId);
    } else {
        initTeacherButtons();
        await initActivationButton(roomId);
        document.getElementById("bnt-next").addEventListener("click", async function () {
            if (document.querySelectorAll("#queue tbody tr:not(#empty_row)").length) {
                nextAnimation();
                await finishCurrentMeeting(roomId);
                await startNextMeeting(roomId);
                await refreshQueueStatus(roomId, userType);
            }
        });
    
        document.getElementById("btn-break").addEventListener("click", async function() {
            if (document.querySelectorAll("#queue tbody tr:not(#empty_row)").length) {
                await finishCurrentMeeting(roomId);
                await refreshQueueStatus(roomId, userType);
            }
        });
    }

    renderQueueTable(roomId, userType);
    renderComments(roomId);
    refreshQueueStatus(roomId, userType);

    var intervalId = window.setInterval(function(){
        renderQueueTable(roomId, userType);
        refreshQueueStatus(roomId, userType);
        getLink(userType, roomId);
        renderComments(roomId);
    }, 5000);
}

async function getUserType() {
    try {
        const userData = await fetch('endpoints/session.php', {
            method: 'GET'
        }).then(data => data.json());
        if (userData['fn']) {
            return 1;
        } else {
            return 2;
        }
    } catch (e) {
        return 0;
    }
}

function addCreateEventButton() {
    var topBar = document.getElementById("nav_top_bar");
    var buttonContainer = document.createElement("div");
    buttonContainer.classList.add("nav-element");
    buttonContainer.setAttribute("id", "nav_new_room");
    buttonContainer.innerHTML = 
        '<img src="img/icons/add.png" alt="panel.html">' +
        'Нова стая';
    topBar.parentNode.insertBefore(buttonContainer, topBar.nextSibling);
}

async function logout() {
    const response = await fetch('endpoints/session.php', {
        method: 'DELETE'
    }).then(data => data.json());

    if(response.success) {
        window.location.href = "index.html";
    }
}