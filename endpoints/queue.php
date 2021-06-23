<?php
    require_once("../src/AppBootStrap.php");

    AppBootStrap::init();

    switch($_SERVER["REQUEST_METHOD"]) {
        case "GET": {  // get students in queue
            SessionRequestHandler::requireLoggedUser();

            if (!isset($_GET["roomId"])) {
                throw new BadRequestException("Room id shoud be provided");
            }

            $studentsData = QueueRequestHandler::getStudentsInQueue($_GET["roomId"]);

            echo json_encode($studentsData);
            break;
        }

        case "POST": { // start queue
            SessionRequestHandler::requireLoggedTeacher();

            $roomId = json_decode(file_get_contents("php://input"), true);
            
            QueueRequestHandler::startQueue($roomId);
            
            echo json_encode(["success" => true]);

            break;
        }
    }

?>