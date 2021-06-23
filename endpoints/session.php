<?php
    require_once("../src/AppBootStrap.php");

    AppBootStrap::init();

    switch($_SERVER["REQUEST_METHOD"]) {
        case "GET": { // get logged user info
            SessionRequestHandler::requireLoggedUser();

            $userData = UserRequestHandler::getUserById($_SESSION["id"]);
            echo json_encode($userData);

            break;
        }
        case "POST": { // login
            $loginData = json_decode(file_get_contents("php://input"), true);
            $user = SessionRequestHandler::login($loginData);
                
            $_SESSION["logged"] = true;
            $_SESSION["id"] = $user['id'];
            $_SESSION["typeId"] = $user['userTypeId'];
            
            echo json_encode(["success" => true]);

            break;
        }
        case "DELETE" : { // logout
            session_destroy();
            echo json_encode(["success" => true]);
        }
    }
?>