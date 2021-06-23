<?php

    require_once("AppBootStrap.php");
    
    AppBootStrap::init(true);

    class SessionRequestHandler {
        const studentTypeId = 1;
        const teacherTypeId = 2;

        public static function login(array $loginData) {
            if (!$loginData) {
                throw new BadRequestException("Login data should be provided");
            }
            
            $connection = self::initConnection();

            $stmt = $connection->prepare("SELECT * FROM users WHERE email=:email");
            $stmt->execute([
                "email" => $loginData["email"]
            ]);
            
            $user = $stmt->fetch();

            if (empty($user) || !password_verify($loginData["password"], $user["password"])) {
                throw new BadRequestException("Incorrect login data");
            }

            return $user;
        }

        public static function requireLoggedUser() {
            if (!$_SESSION["logged"] || !$_SESSION["id"]) {
                throw new AuthorizationException();
            }
        }

        public static function requireLoggedTeacher() {
            if (!$_SESSION["logged"] || !$_SESSION["id"] || $_SESSION["typeId"] != self::teacherTypeId) {
                throw new AuthorizationException();
            }
        }

        private static function initConnection() {
            return (new DB())->getConnection();
        }
    }
    

?>