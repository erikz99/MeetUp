<?php

    require_once("../src/AppBootStrap.php");

    AppBootStrap::init();

    switch($_SERVER["REQUEST_METHOD"]) {
        case "GET": { // get link
            SessionRequestHandler::requireLoggedUser();
            
            if (!isset($_GET["roomId"])) {
                throw new BadRequestException("Room id shoud be provided");
            }

            $link = StudentsRequestHandler::getLink($_GET["roomId"], $_SESSION["id"]);

            echo json_encode(["link" => $link]);

            break;
        }
        case "POST": { // enter the queue 
            SessionRequestHandler::requireLoggedUser();

            $roomId = json_decode(file_get_contents("php://input"), true);

            StudentsRequestHandler::addToQueue($_SESSION["id"], $roomId);

            echo json_encode(["success" => true]);

            break;
        }
    }
?>