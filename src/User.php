<?php

class User implements JsonSerializable
{
    private $username;
    private $email;
    private $id;

    public function __construct(string $username, string $email, int $id)
    {
        $this->username = $username;
        $this->email = $email;
        $this->id = $id;
    }
    
    public function getUsername() : string {
        return $this->username;
    }

    public function getEmail() : string {
        return $this->email;
    }

    public function getId() : int {
        return $this->id;
    }

    // Override
    public function jsonSerialize(): array {
        $fieldsToSerialize = ["username", "email", "id"];

        $jsonArray = [];

        foreach ($fieldsToSerialize as $field) {
            $jsonArray[$field] = $this->$field;
        }

        return $jsonArray;
    }
}