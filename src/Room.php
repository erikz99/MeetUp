<?php

class Room implements JsonSerializable
{
    private $id;
    private $name;
    private $waitingInterval;
    private $meetInterval;
    private $start;
    private $activated;

    public function __construct($id, $name, $waitingInterval, $meetInterval, $start, $activated)
    {
        $this->name = $name;
        $this->waitingInterval = $waitingInterval;
        $this->meetInterval = $meetInterval;
        $this->start = $start;
        $this->id = $id;
        $this->activated = $activated;
    }
    
    public function getId() {
        return $this->id;
    }
    
    public function getName() {
        return $this->name;
    }

    public function getWaitingInterval() {
        return $this->waitingInterval;
    }

    public function getMeetInterval() {
        return $this->meetInterval;
    }

    public function getStart() {
        return $this->start;
    }

    //Override
    public function jsonSerialize() {
        $fieldsToSerialize = ["id" ,"name", "waitingInterval", "meetInterval", "start", "activated"];

        $jsonArray = [];

        foreach ($fieldsToSerialize as $field) {
            $jsonArray[$field] = $this->$field;
        }

        return $jsonArray;
    }
}