<?php

    class BadRequestException extends Exception {
        public function __construct($msg) {
            parent::__construct($msg);
        }
    }

?>