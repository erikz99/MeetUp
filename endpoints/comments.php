<?php
    require_once("../src/AppBootStrap.php");

    AppBootStrap::init();

    switch($_SERVER["REQUEST_METHOD"]) {
        case "GET": { // get comments by room 
            SessionRequestHandler::requireLoggedUser();

            if (!isset($_GET["roomId"])) {
                throw new BadRequestException("Room id should be provided");
            }

            $response = CommentRequestHandler::getComments($_GET["roomId"]);

            echo json_encode($response);

            break;
        }
        case "POST" : { // post comment
            SessionRequestHandler::requireLoggedUser();

            $newCommentData = json_decode(file_get_contents("php://input"), true);

            $commentId = CommentRequestHandler::createComment($newCommentData, $_SESSION["id"]);
            
            echo json_encode(["success" => true]);
            break;
        }
    }
?>