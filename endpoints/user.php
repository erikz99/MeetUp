<?php
    require_once("../src/AppBootStrap.php");

    AppBootStrap::init();

    switch($_SERVER["REQUEST_METHOD"]) {
        case "GET": { // get user by id
            if (!isset($_GET["id"]) || !$_GET["id"]) {
                throw new BadRequestException("The user id parameter should be provided");
            } else {
                $returnData = UserRequestHandler::getUserById($_GET["id"]);
            }
            
            $returnData = UserRequestHandler::getUserById($_SESSION["id"]);
            echo json_encode($returnData);

            break;
        }
        case "POST": { // register
            $newPersonData = json_decode(file_get_contents("php://input"), true);

            $userId = UserRequestHandler::createUser($newPersonData);

            echo json_encode(["success" => true]);
            break;
        }
        case "PUT" : {
            break;
        }
    }

?>