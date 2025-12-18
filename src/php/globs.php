<?php

define("M", $_POST['m'] ?? '');

if (!M ?? false) {
    die;
}

switch (M) {
    case 'write': {
        $fileText = file_get_contents(__DIR__ . '/____write.py');
        echo $fileText;
        break;
        
        
    }
}