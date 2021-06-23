<?php
    require_once("User.php");

    class Comment implements JsonSerializable  {
        private $content;
        private $createdAt;

        public function __construct($content, $createdAt) {
            $this->content = $content;
            $this->createdAt = $createdAt;
        }

        public function getContent() {
            return $this->content;
        }

        public function getCreatedAt() {
            return $this->createdAt;
        }

         // Override
         public function jsonSerialize(): array {
            $fieldsToSerialize = ["content", "createdAt"];

            $jsonArray = [];
            
            foreach ($fieldsToSerialize as $field) {
                $jsonArray[$field] = $this->$field;
            }
    
            return $jsonArray;
        }
    }
?>