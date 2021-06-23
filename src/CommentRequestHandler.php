<?php
    date_default_timezone_set('Europe/Sofia');
    require_once("AppBootStrap.php");

    AppBootStrap::init();

    class CommentRequestHandler {

        public static function getComments($roomId) {
            if (!$roomId) {
                throw new BadRequestException("Room id should be provided");
            }

            $connection = self::initConnection();
            
            $stmt = $connection->prepare("SELECT users.name, users.email, users.id, comments.content, comments.createdAt
                                          FROM comments JOIN users ON comments.userId=users.id 
                                          WHERE roomId=:roomId 
                                          ORDER BY createdAt ASC");

            $stmt->execute([
                "roomId" => $roomId
            ]);

            $comments = [];

            while ($row = $stmt->fetch()) {
                
                $comment = new Comment($row["content"], $row["createdAt"]);

                $comments[] = [
                    "comment" => $comment,
                    "user" => $row["name"]
                ];
            }

            return $comments;
        }

        public static function createComment($commentData, $userId) {
            if (!$commentData) {
                throw new BadRequestException("Comment data should be provided");
            }

            $connection = self::initConnection();

            $stmt=$connection->prepare("INSERT INTO comments (userId, roomId, content) VALUES (:userId, :roomId,
                :content)");
            $stmt->execute([
                "userId" => $userId,
                "roomId" => $commentData["roomId"],
                "content" => $commentData["content"],
            ]);

            $commentId = $connection->lastInsertId();

            return $commentId;
        }

        private static function initConnection() {
            return (new DB())->getConnection();
        }
    }
?>