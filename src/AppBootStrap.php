<?php

    class AppBootStrap {

        public static function init() {
            if (!isset($_SESSION)) {
                session_start();
            }

            spl_autoload_register(function($className) {
                if (str_contains($className,"Exception")) {
                    require_once("../exceptions/" . $className . ".php");
                } else {
                    require_once("../src/" . $className . ".php");
                }
            });

            set_exception_handler(function($exception) {
                $response_body = [];
    
                if ($exception instanceof BadRequestException) {
                    http_response_code(400);
                    $response_body = ["message" => $exception->getMessage()];
                } else if ($exception instanceof NotFoundException) {
                    http_response_code(404);
                    $response_body = ["message" => $exception->getMessage()];
                } else if ($exception instanceof AuthorizationException) {
                    http_response_code(403);
                    $response_body = ["message" => $exception->getMessage()];
                } else {
                    http_response_code(500);
                    $response_body = ["message" => "Unknown error. Please try your request later"];
                }
                
                echo json_encode($response_body, JSON_UNESCAPED_UNICODE);
            });
        }
    }

?>