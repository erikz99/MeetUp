<?php
    require_once("User.php");

    class Student extends User {
        private $fn;

        private $year;

        private $degree;

        private const typeId = 1;

        public function __construct(string $username, string $email, int $id, int $fn, int $year, 
                string $degree ) {
            parent::__construct($username, $email, $id);

            $this->fn = $fn;
            $this->year = $year;
            $this->degree = $degree;
        }

        public function getTypeId() : int {
            return self::typeId;
        }

        public function getFn() : int {
            return $this->fn;
        }

        public function getYear() : int {
            return $this->year;
        }

        public function getDegree() : string {
            return $this->degree;
        }

         // Override
         public function jsonSerialize(): array {
            $fieldsToSerialize = ["fn", "year", "degree"];
    
            $jsonArray = [];
            $jsonArray["username"] = $this->getUsername();
            $jsonArray["email"] = $this->getEmail();
            $jsonArray["id"] = $this->getId();

            foreach ($fieldsToSerialize as $field) {
                $jsonArray[$field] = $this->$field;
            }
    
            return $jsonArray;
        }
    }
?>