<?php

    require_once("AppBootStrap.php");

    AppBootStrap::init();

    class RoomRequestHandler {

        public static function createRoom($roomData) {
            if (!$roomData) {
                throw new BadRequestException("Room data should be provided");
            }

            $connection = self::initConnection();

            $stmt = $connection->prepare("INSERT INTO rooms (name, waitingInterval, meetInterval,
                userId, start) VALUES (:name, :waitingInterval, :meetInterval, :userId, :start)");
            $stmt->execute([
                "name" => $roomData["name"],
                "waitingInterval" => $roomData["waitingInterval"],
                "meetInterval" => $roomData["meetInterval"],
                "userId" => $_SESSION["id"],
                "start" => $roomData["start"]
            ]);

            $roomId = $connection->lastInsertId();
            
            $emails = $roomData["schedule"];

            if (!$emails) {
                throw new BadRequestException("Users emails should be provided");
            }

            $place = 1;

            $studentsData = [];

            $list = "";

            foreach ($emails as $email) {
                $studentsData[$email]["place"] = $place;
                $place++;
                $list = $list . "'". $email . "'" . ",";
            }
            $list = substr_replace($list, "", -1);
      
            $stmt = $connection->prepare("SELECT * FROM users WHERE email IN ( " . $list . " )");
            $stmt->execute(); 
            
            while ($row = $stmt->fetch()) {
                $studentsData[$row["email"]]["id"] = $row["id"];
            }

            foreach ($studentsData as $student) {
                $stmt = $connection->prepare(
                    "INSERT INTO schedule (userId, roomId, place) VALUES (:userId, :roomId, :place)");
                $stmt->execute([
                    "userId" => $student["id"],
                    "roomId" => $roomId,
                    "place" => $student["place"]
                ]);
            }

            return $roomId;
        }

        public static function getUserRooms($id) {
            if (!$id) {
                throw new BadRequestException("User id should be provided");
            }

            $userTypeId = $_SESSION["typeId"];

            $connection = self::initConnection();

            $stmt = $connection->prepare("SELECT * FROM usertypes WHERE id=:id");

            $stmt->execute([
                "id" => $userTypeId
            ]);

            $role = $stmt->fetch();

            $response = [];

            if ($role["code"] == "TEACHER") {
                $stmt = $connection->prepare("SELECT * FROM rooms WHERE userId=:userId");
                $stmt->execute([
                    "userId" => $id
                ]);

                while ($row = $stmt->fetch()) {
                    $response[] = new Room($row["id"], $row["name"], $row["waitingInterval"], $row["meetInterval"], $row["start"], $row['activated']);
                }

            } else if ($role["code"] == "STUDENT") {
                $stmt = $connection->prepare(
                    "SELECT rooms.*, users.name AS teacher, schedule.place
                    FROM schedule JOIN rooms ON schedule.roomId = rooms.id
                    JOIN users ON rooms.userId = users.id
                    WHERE schedule.userId=:userId"
                );

                $stmt->execute([
                    "userId" => $id
                ]);
                
                while ($row = $stmt->fetch()) {
                    $response[] = [
                        "room" => new Room($row["id"], $row["name"], $row["waitingInterval"], $row["meetInterval"], $row["start"], $row["activated"]),
                        "teacher" => $row['teacher'],
                        "place" => $row["place"]
                    ];
                }
            }
            
            return $response;
        }

        private static function initConnection() {
            return (new DB())->getConnection();
        }

    }

?>