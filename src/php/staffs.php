<?php

if (!session_id())
    session_start();

define("M", $_GET['m']);

if (!M ?? false) {
    die;
}

require_once 'db.php';
require_once 'rate_limiter.php';


toGlobal($_POST);

$table = "staffs";

switch (M) {
    case "login": {
        // Cek rate limit untuk login (lebih ketat: 5 attempts per 15 minutes)
        checkLoginRateLimit();

        // validate param
        if (($validate = validateEmptyVar("username|password", true)) !== true) {
            echo json_encode(['status' => false, 'msg' => $validate, 'post' => $_POST]);
            break;
        }

        $staff = $db->query("SELECT * FROM $table WHERE username = '$username'")->fetch_assoc();

        // validate db
        if (empty($staff)) {
            echo json_encode(['status' => false, 'msg' => "Akun tidak ditemukan!", 'post' => $_POST]);
            break;
        }

        if ($staff['password'] !== $password) {
            echo json_encode(['status' => false, 'msg' => "Password salah!", 'post' => $_POST]);
            break;
        }

        // make session
        $_SESSION['auth'] = [
            'id' => $staff['id'],
            'username' => $username,
            'level' => $staff['level'],
        ];

        echo json_encode(['status' => true, 'msg' => 'Berhasil login.', 'post' => $_POST]);
        break;
    }

    case 'get-session': {
        if (($auth = $_SESSION['auth'] ?? null) !== null) {
            echo json_encode(['status' => true, 'auth' => $auth]);
        } else {
            echo json_encode(['status' => false, 'msg' => "Sesi tidak ditemukan!"]);
        }

        break;
    }

    case 'clear': {
        $_SESSION = [];
        echo json_encode(['status' => true, 'msg' => "Berhasil menghapus sesi."]);

        break;
    }

    case 'get-all-staff': {

        $query = "SELECT * FROM $table WHERE level IS NULL";

        $res = $db->query($query);

        $data = [];

        while ($row = mysqli_fetch_assoc($res)) {
            $data[] = $row;
        }

        echo json_encode(['status' => true, 'data' => $data]);
        
        break;
    }
}