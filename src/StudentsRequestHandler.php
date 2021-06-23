<?php

    require_once("AppBootStrap.php");
    
    AppBootStrap::init();

    class StudentsRequestHandler {
        const studentId = 1;

        public static function getAllStudents() {

            $connection = self::initConnection();

            $stmt = $connection->query(
                "SELECT name, user.id, email, fn, year, degree
                 FROM 
                 users INNER JOIN students_details ON users.id=students_details.userId");
            
            $students = [];

            while ($row = $stmt->fetch()) {
                $students[] = new Student($row["name"], $row["email"], $row["id"], $row["fn"], $row["year"], $row["degree"] );
            }

            return $students;
        }

        public static function getLink($roomId, $userId) {
            if (!$userId || !$roomId) {
                throw new BadRequestException("User and room id should be provided");
            }

            $connection = self::initConnection();

            $stmt = $connection->prepare(
                "SELECT * FROM queues WHERE roomId=:roomId AND userId=:userId"
            );

            $stmt->execute([
                "roomId" => $roomId,
                "userId" => $userId
            ]);

            $student = $stmt->fetch();

            if (!$student) {
                throw new BadRequestException("Invalid student");
            }

            if ($student["active"] == 0) {
                return "";
            }

            return "bbb.fmi.uni-sofia.bg/id=4214";
        }

        public static function addToQueue($userId, $roomId) {
            if (!$userId || !$roomId) {
                throw new BadRequestException("User id and room id should be provided");
            }

            $connection = self::initConnection();

            $stmt = $connection->prepare(
                "SELECT * FROM schedule WHERE roomId=:roomId AND userId=:userId"
            );

            $stmt->execute([
                "userId" => $userId,
                "roomId" => $roomId
            ]);

            $user = $stmt->fetch();

            if (!$user) {
                throw new AuthorizationException("Student doesn't belong to that room");
            }

            $stmt = $connection->prepare(
                "INSERT INTO queues (roomId, userId, userIndex) VALUES (:roomId, :userId, :userIndex)"
            );

            $stmt->execute([
                "roomId" => $user["roomId"],
                "userId" => $user["userId"],
                "userIndex" => $user["place"]
            ]);
        }

        private static function initConnection() {
            return (new DB())->getConnection();
        }
    }
?>