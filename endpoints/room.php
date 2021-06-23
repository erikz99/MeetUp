<?php
    require_once("../src/AppBootStrap.php");

    AppBootStrap::init();


    switch($_SERVER["REQUEST_METHOD"]) {
        case "GET": {  // get user's rooms 
            SessionRequestHandler::requireLoggedUser();

            $roomsData = RoomRequestHandler::getUserRooms($_SESSION["id"]);

            echo json_encode($roomsData);
            break;
        }
        case "POST": { // create room
            SessionRequestHandler::requireLoggedTeacher();

            $newRoomData = json_decode(file_get_contents("php://input"), true);

            $roomId = RoomRequestHandler::createRoom($newRoomData);
            
            echo json_encode(["success" => true]);
            break;
        }
    }

?>