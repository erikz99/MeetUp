<?php

    class NotFoundException extends Exception {
        public function __construct($msg = "The resource is not found") {
            parent::__construct($msg);
        }
    }

?>