<?php

    class AuthorizationException extends Exception {
        public function __construct($msg = "User not authorized to do this action") {
            parent::__construct($msg);
        }
    }

?>