<?php
    require_once("../src/AppBootStrap.php");

    AppBootStrap::init();

    switch($_SERVER["REQUEST_METHOD"]) {
        case "GET": { // get schedule by room id
            SessionRequestHandler::requireLoggedUser();

            if (!isset($_GET["roomId"])) {
                throw new BadRequestException("Room id should be provided");
            }

            $schedule = ScheduleRequestHandler::getSchedule($_GET["roomId"]);

            echo json_encode($schedule);

            break;
        }
    }
?>