async function loadEvents (userType) {
    var events = await fetch('endpoints/room.php', {
        method: 'GET'
    }).then(data => data.json());

    var container = document.getElementById("events");

    if(events.length) {
        var activeIds = [];
        for (var eventId in events) {
            if (userType == 1 && events[eventId].room["activated"] == 1) {
                activeIds.push(events[eventId].room["id"]);
            }
            var eventHTML = getEventHTML(userType, events[eventId]);
            container.insertAdjacentHTML('beforeend', eventHTML);
        }

        document.querySelectorAll(".event").forEach(function(element) {
            element.addEventListener("click", function() {
                if (activeIds.includes(this.getAttribute("id")) || userType == 2) {
                    window.location.href = "queue.html?roomId=" + this.getAttribute("id");
                }
            });
        })
    } else {
        var message = userType == 1 ? 
            '<p>Няма събития, за които да сте поканени.</p>' :
            '<p>Нямате създадени събития.</p>';
        var noEventsMessage = 
            '<div class="event-info-container">' + 
                message +
            '</div>';
        container.insertAdjacentHTML('beforeend', noEventsMessage);
    }
}

function getEventHTML (userType, event) {
    var startData = userType == 2 ? event["start"].split(" ") : event.room["start"].split(" ");
    var date = startData[0].split("-");
    var time = startData[1].split(":");
    var start = date[2] + "." + date[1] + "." + date[0] + " в " + time[0] + ":" + time[1] + "ч.";
    
    if (userType === 1) {
        return getStudentEvent(event, start, time);
    } else {
        return getTeacherEvent(event, start);
    }
}

function getStudentEvent(event, start, time) {
    var minutes = (parseInt(event.room['meetInterval']) + parseInt(event.room['waitingInterval'])) * (parseInt(event['place']) - 1);
    var startTime = new Date();
    startTime.setHours(time[0]);
    startTime.setMinutes(time[1]);
    startTime = new Date(startTime.getTime() + minutes * 60000);

    var eventHTML =
        '<div class="event" id="'+  event.room['id'] + '">' +
            '<header>' +
                '<h2 class="name" class="bold">' + event.room["name"] + '</h2>' +
                '<h3 class="date">' + start + '</h3>' +
            '</header>' +
            '<article class="event-info-container one-row">' +
                '<h3 class="place">' +
                    '<span class="heading-label">Ред: </span>' + 
                    '<span class="lighter">' + event['place']  + '</span>' +
                '</h3>' +
                '<h3 class="place_time">' +
                    '<span class="heading-label">Час за реда: </span>' +
                    '<span class="lighter">' + startTime.getHours() + ":" + startTime.getMinutes() + '</span>' +
                '</h3>' +
                '<h3 class="teacher">' +
                    '<span class="heading-label">Препозавател: </span>' +
                    '<span  class="lighter">' + event['teacher'] + '</span>' +
                '</h3>' +
            '</article>' +
        '</div>';

    return eventHTML;
}

function getTeacherEvent(event, start) {
    var eventHTML =
        '<div class="event" id="'+ event['id'] + '">' +
            '<header>' +
                '<h2 class="name" class="bold">' + event["name"] + '</h2>' +
                '<h3 class="date">' + start + '</h3>' +
            '</header>' +
            '<article class="event-info-container one-row-even">' +
                '<h3 class="meet-interval">' +
                    '<span class="heading-label">Време за среща: </span>' +
                    '<span class="lighter">' + event['meetInterval'] + ' мин.</span>' +
                '</h3>' +
                '<h3 class="waiting-interval">' +
                    '<span class="heading-label">Време за чакане: </span>' +
                    '<span  class="lighter">' + event['waitingInterval'] + ' мин.</span>' +
                '</h3>' +
            '</article>' +
        '</div>';

    return eventHTML;
}

async function loadUserInfo (userType) {
    const userData = await fetch('endpoints/session.php', {
        method: 'GET'
    }).then(data => data.json());

    var container = document.getElementById("profile");
    var userHTML = getUserHTML(userType, userData);
    container.innerHTML = userHTML;
}

function getUserHTML (userType, userData) {
    if (userType === 1) {
        var userHTML = 
            '<div class="row columns">' +
                '<h2>Име: <span class="lighter">' + userData['username'] + '</span></h2>' +
                '<h2 id="fn">ФН: <span class="lighter">' + userData['fn'] + '</span></h2>' +
            '</div>' +
            '<h2 class="row">Имейл: <span class="lighter">' + userData['email'] + '</span></h2>' +
            '<h2 class="row">Специалност: <span class="lighter">' + userData['degree'] + '</h2>' +
            '<h2 class="row">Година: <span class="lighter">' + userData['year'] + '</span></h2>';
    } else {
        var userHTML = 
            '<h2>Име: <span class="lighter">' + userData['username'] + '</span></h2>' +
            '<h2 class="row">Имейл: <span class="lighter">' + userData['email'] + '</span></h2>';
    }

    return userHTML;
}