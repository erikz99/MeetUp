async function renderQueueTable(roomId, userType) {
    const response = await fetch("endpoints/queue.php?roomId=" + roomId, {
        method: 'GET'
    }).then(data => data.json());

    var queue = document.querySelector("#queue tbody");
    var tableHTML = "";

    if (response['students'].length > 0) {
        for(var i = 0; i < response['students'].length; i++) {
            var isActive = response['students'][i]['id'] === response['activeId'];
            tableHTML += 
                '<tr id="' + response['students'][i]['id'] + '"' + (isActive ? 'class="active"' : '') + '>' +
                    '<td>' + (i + 1) + '</td>' +
                    '<td>' + response['students'][i]['name'] + '</td>' +
                '</td>';
        }
    } else {
        tableHTML = 
        '<tr id="empty_row">' +
            '<td colspan="2">Няма студенти в опашката.</td>' + 
        '</tr>';
    }
    
    queue.innerHTML = tableHTML;

    if(userType === 2) {
        document.querySelectorAll("#queue tbody tr").forEach(function(element) {
            if (element.getAttribute("id") != "empty_row") {
                element.addEventListener("click", function () {
                    var studentId = element.getAttribute("id");
                    selectNextMeeting(roomId, studentId);
                });
            }
        });
    }
}

async function renderScheduleTable(roomId) {
    const response = await fetch("endpoints/schedule.php?roomId=" + roomId, {
        method: 'GET'
    }).then(data => data.json());
    
    var schedule = document.querySelector("#schedule tbody");
    var tableHTML = "";
    if (response.length > 0) {
        for(var i = 0; i < response.length; i++) {
            tableHTML += 
                '<tr>' +
                    '<td>' + (i + 1) + '</td>' +
                    '<td>' + response[i]['name'] + '</td>' +
                '</td>';
        }
    } else {
        tableHTML = 
        '<tr>' +
            '<td colspan="2">Няма график.</td>' + 
        '</tr>';
    }
    
    schedule.innerHTML = tableHTML;
}

async function startEvent(roomId) {
    const response = await fetch("endpoints/queue.php?roomId=" + roomId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: roomId,
    }).then(data => data.json());   
}

async function refreshQueueStatus(roomId, userType) {
    var statusData = await getQueueStatus(roomId);
    var statusElement = document.getElementById("status");

    if (statusData[0].id === "not_started" && userType === 1) {
        window.location.href = "panel.html";
    }
    
    if (statusData[0].id === "meeting" && 
    (statusElement.classList.contains("waiting") || statusElement.classList.contains("finished"))) {
        nextAnimation();
    }

    statusElement.textContent = statusData[0].response;
    statusElement.classList.remove("waiting", "meeting", "finished");
    statusElement.classList.add(statusData[0].id);
}

async function getQueueStatus(roomId) {
    const response = await fetch("endpoints/get-queue-state.php?roomId=" + roomId, {
        method: 'GET'
    }).then(data => data.json());
    return response;
}

async function getLink(userType, roomId) {
    if (userType === 1) {
        const response = await fetch("endpoints/students.php?roomId=" + roomId, {
            method: 'GET'
        }).then(data => data.json());

        if (response.link && !document.getElementById("link_wrapper")) {
            showLink(response.link);
        } else if (!response.link && document.getElementById("link_container")) {
            window.location.href = "panel.html";
        }
    }
}

async function finishCurrentMeeting(roomId) {
    const response = await fetch("endpoints/pause-queue.php?roomId=" + roomId, {
        method: 'GET'
    }).then(data => data.json()); 
}

async function startNextMeeting(roomId) {
    const response = await fetch("endpoints/process-queue.php?roomId=" + roomId, {
        method: 'GET'
    }).then(data => data.json()); 
}

async function enterQueue(roomId){
    const response = fetch("endpoints/students.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: roomId,
    }).then(data => data.json());
}

async function startQueue(roomId) {
    const response = fetch("endpoints/queue.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: roomId,
    }).then(data => data.json());
}

async function endQueue(roomId) {
    const response = fetch("endpoints/queue.php?active=0", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: roomId,
    }).then(data => data.json());
}

async function selectNextMeeting(roomId, studentId) {
    const response = await fetch(
    "endpoints/process-queue.php?roomId=" + roomId + "&studentId=" + studentId, {
        method: 'GET'
    }).then(data => data.json()); 
}

function initTeacherButtons() {
    var container = document.getElementById("btn-container");
    var buttonsHtml = 
        '<button id="bnt-next" class="gradient-btn-green">Следващ</button>' +
        '<button id="btn-break" class="gradient-btn-yellow">Почивка</button>' + 
        '<button id="btn-activate" class="gradient-btn">Старт</button>';

    container.innerHTML = buttonsHtml;
}

async function initActivationButton(roomId) {
    await renderActivationButton(roomId);

    document.getElementById("btn-activate").addEventListener("click", async function() {
        var queueStatus = await getQueueStatus(roomId);

        if (queueStatus[0]['id'] === "not_started") {
            await startQueue(roomId);
        } else {
            await endQueue(roomId);
        }

        await renderActivationButton(roomId);
    })
}

async function renderActivationButton(roomId) {
    var statusData = await getQueueStatus(roomId);
    var status = statusData[0]['id'];
    var activationButton = document.getElementById("btn-activate");

    if (status === "not_started") {
        activationButton.textContent = "Старт";
        activationButton.classList.replace("gradient-cancel-btn", "gradient-btn");
    } else {
        activationButton.textContent = "Край";
        activationButton.classList.replace("gradient-btn", "gradient-cancel-btn");
    }
}

async function getRoomData(roomId, userType) {
    var roomsData = await fetch('endpoints/room.php', {
        method: 'GET'
    }).then(data => data.json());

    for (roomData of roomsData) {
        if (userType == 1 && roomData.room['id'] == roomId) {
            return roomData.room;
        } else if (userType == 2 && roomData['id'] == roomId) {
            return roomData;
        }
    }
}

function showLink(link) {
    var container = document.getElementById("progress_container");
    var linkHTML = 
        '<div id="link_container">' +
            '<h2>Твой ред е!</h2>' +
            '<label for="link">Посети следния линк:</label>' +
            '<input id="link" name="link" value="' + link + '" disabled>' +
        '</div>';
    var linkContainer = document.createElement("div");

    linkContainer.setAttribute("id", "link_wrapper");
    linkContainer.innerHTML = linkHTML;
    container.append(linkContainer);
}

function nextAnimation() {
    var images = document.querySelectorAll(".animation-img");
    var currentStudent = parseInt(images[3].getAttribute("id").replace("img_", ""));
    var nextStudent = (currentStudent + 1) % 5 != 0 ? (currentStudent + 1) % 5 : 5;

    var fadeInImg = document.createElement("img");
    fadeInImg.setAttribute("src", "img/pages/student_" + nextStudent + ".png");
    fadeInImg.setAttribute("id", "img_" + nextStudent);

    images[3].remove();
    images[0].classList.remove("fadein-img");
    images[1].classList.remove("move-img");
    images[2].classList.remove("move-img");
    
    images[0].parentNode.insertBefore(fadeInImg, images[0]);
    fadeInImg.classList.add("fadein-img", "animation-img");
    images[0].classList.add("move-img");
    images[1].offsetHeight;
    images[1].classList.add("move-img");
    images[2].classList.add("fadeaway-img");
}

async function addComment(roomId) {
    const data = {
        "content": document.getElementById("comment_add").value,
        "roomId": roomId
    };
    const response = fetch("endpoints/comments.php", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then(data => data.json());

    document.getElementById("comment_add").value = "";
}

async function renderComments(roomId) {
    const response = await fetch("endpoints/comments.php?roomId=" + roomId, {
        method: 'GET'
    }).then(data => data.json());
    const commnetsCount = document.getElementsByClassName("comment").length;

    if (commnetsCount < response.length) {
        for (var i = commnetsCount; i < response.length; i++) {
            var commentNode = document.createElement("article");
            commentNode.classList.add("comment");
            commentNode.innerHTML = getCommentHTML(response[i]);
            document.getElementById("commnets-wrapper").appendChild(commentNode);
        }
        
        var wrapper = document.getElementById("commnets-wrapper")
        wrapper.scrollTop = wrapper.scrollHeight;
    }
}

function getCommentHTML(commentData) {
    return '<header class="comment-header">' +
            '<h3>' + commentData.user + '</h3>' +
            '<h3>' + commentData.comment['createdAt'].split(" ")[1].substring(0, 5) + '</h3>' +
        '</header>' +
        '<p class="comment-data">' + commentData.comment.content + '</p>';
}