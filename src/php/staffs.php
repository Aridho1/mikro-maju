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
$appName = "Auth";

header("Content-Type: application/json");

try {
    switch (M) {
        case "login": {
            // Cek rate limit untuk login (lebih ketat: 5 attempts per 15 minutes)
            checkLoginRateLimit();

            // validate param
            if (($validate = validateEmptyVar("username|password", true)) !== true) {
                echo json_encode(['status' => false, 'msg' => $validate, 'post' => $_POST]);
                break;
            }

            $q = "SELECT * FROM $table WHERE username = '$username'";

            $staff = $db->query($q)->fetch_assoc();

            // validate db
            if (!$staff) throw new Exception("Akun Tidak ditemukan!");
            // if (empty($staff)) {
            //     echo json_encode(['status' => false, 'msg' => "Akun tidak ditemukan!", 'post' => $_POST]);
            //     break;
            // }

            if ($staff['password'] !== $password) throw new Exception("Password Salah!");
            // if ($staff['password'] !== $password) {
            //     echo json_encode(['status' => false, "a" => 'a', "staff" => $staff, 'msg' => "Password salah!", 'post' => $_POST]);
            //     break;
            // }

            // make session
            $_SESSION['auth'] = [
                'id' => $staff['id'],
                'username' => $username,
                'level' => $staff['level'],
            ];

            die(json_encode(['status' => true, 'msg' => 'Berhasil login.', 'post' => $_POST]));
        }

        case 'get-session': {
            if (($auth = $_SESSION['auth'] ?? null) !== null) {
                echo json_encode(['status' => true, 'auth' => $auth]);
            } else {
                echo json_encode(['status' => false, 'msg' => "Sesi tidak ditemukan!"]);
            }
            die;
        }

        case 'clear': {
            $_SESSION = [];
            die(json_encode(['status' => true, 'msg' => "Berhasil menghapus sesi."]));
        }

        case 'get-all-staff': {
            $data = $db->query("SELECT * FROM $table WHERE level IS NULL")->fetch_all(MYSQLI_ASSOC);
            die(json_encode(['status' => true, 'data' => $data]));
        }
    }
} catch (Exception $e) {
    $err = $e->getMessage();

    die(json_encode([
        "status" => false,
        "msg" => $err,
        "post" => $_POST
    ]));
}