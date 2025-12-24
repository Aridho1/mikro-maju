<?php

define("M", $_GET['m']);

if (!M ?? false) {
    die;
}

require_once 'db.php';


if (!session_id()) session_start();

toGlobal($_POST);

$table = "attandance";
$appName = "Absen";

$auth = $_SESSION["auth"] ?? false;


header("Content-Type: application/json");

try {
    switch (M) {
        case "add": {
            // validate auth
            if (!$auth) throw new Exception("Authentifikasi tidak ditemukan!");

            // validate input
            validateEmptyVar("status|type|time", true, true);

            // check owner
            $staff_id = $auth['level'] ? $staff_id : $auth['id'];
            $salary = $auth['level'] ? $salary : "NULL";

            $date = date('Y-m-d');
            $timestamp = ((int) microtime(true)) * 1000;

            $query = "INSERT INTO $table SET staff_id = $staff_id, date = '$date', time = '$time', status = '$status', salary = $salary, type = '$type', timestamp = $timestamp";

            $db->query($query);

            die(json_encode(['status' => true, 'msg' => "$db->affected_rows $appName berhasil ditamahkan."]));
        }
        case 'search': {

            $page ??= false;
            $page = (Int) ($page ?? 1);

            $sql = " FROM $table a JOIN staffs s ON s.id = a.staff_id WHERE 1 ";

            // check owner
            if (!$_SESSION['auth']['level']) {
                $id = $_SESSION['auth']['id'];
                $sql .= " AND a.staff_id = $id ";
            }
            
            $conditions = [];

            if ($keyword ?? false) {

                $_filters = ["s.id", "s.username"];

                foreach ($_filters as $key) 
                    $conditions[] = "$key LIKE '%$keyword%'";

                if (!empty($conditions))
                    $sql .= " AND (" . implode(' OR ', $conditions) . ")";
            }

            if ($statuses ?? false) {

                $arr = explode(",", $statuses);
                $conditions = [];

                foreach ($arr as $key)
                    $conditions[] = "status = '$key'";

                if (!empty($conditions))
                    $sql .= " AND (" . implode(' OR ', $conditions) . ")";

            }

            if ($types ?? false) {

                $arr = explode(",", $types);
                $conditions = [];

                foreach ($arr as $key)
                    $conditions[] = "type = '$key'";

                if (!empty($conditions))
                    $sql .= " AND (" . implode(' OR ', $conditions) . ")";

            }

            // filter date
            $date_start ??= false;
            $date_end ??= false;

            if ($date_start && $date_end) {
                $sql .= " AND (date >= '$date_start' AND date <= '$date_end') ";
            }


            $sql .= $_POST['sort_desc'] ?? false ? " ORDER BY ID DESC " : "";

            try {
                $max_data = $config['pagination']['max_data'];
            } catch (Exception $e) {
                $max_data = 5;
            }

            $page = $page < 1 ? 1 : $page;

            $offset = ($page - 1) * $max_data;

            $sql = "SELECT SQL_CALC_FOUND_ROWS a.*, s.username $sql LIMIT $offset, $max_data";

            $data = $db->query($sql)->fetch_all(MYSQLI_ASSOC);

            // Calc paginate
            $total_data = $db->query("SELECT FOUND_ROWS() AS total_data")->fetch_assoc()['total_data'];
            $total_page = ceil($total_data / $max_data);

            $offset = ($page - 1) * $max_data;
            $offset = $offset < 0 ? 0 : $offset;

            $start_index = $total_data == 0 ? 0 : $offset + 1;
            $end_index = $offset + $max_data > $total_data ? $total_data : $offset + $max_data;

            $pagination = [
                'total_data' => $total_data,
                'max_data' => $max_data,
                'total_page' => $total_page,
                'page' => $page,
                'offset' => $offset,
                'start_index' => $start_index,
                'end_index' => $end_index,
            ];

            die(json_encode(['status' => true, 'data' => $data, 'query' => $sql, 'pagination' => $pagination, 'post' => $_POST]));
        }
        case 'get': {
            $data = $db->query("SELECT * FROM $table")->fetch_all(MYSQLI_ASSOC);
            die(json_encode(['status' => true, 'data' => $data]));
        }
        case 'remove': {

            validateEmptyVar("id|staff_id", true, true);
            // $validated = validateEmptyVar("id|staff_id");

            $_staff_id = $auth['id'];
            
            // validate auth
            if ($_staff_id != $staff_id) {
                throw new Exception("ID STAFF BERBEDA\nKamu tidak bisa menghapus absen orang lain.");
                // echo json_encode(['status' => false, 'msg' => "ID STAFF BERBEDA\nKamu tidak bisa menghapus absen orang lain.", 'post' => $_POST]);
                // die;

            }

            $db->query("DELETE FROM $table WHERE id='$id' AND staff_id = '$staff_id'");

            die(json_encode(['status' => true, 'msg' => "$db->affected_rows $appName berhasil dihapus."]));
        }
    }
} catch (Exception $e) {
    $err = $e->getMessage();

    die(json_encode([
        "status" => false,
        "msg" => $err,
        // "post" => $_POST
    ]));
}