<?php

define("M", $_GET['m']);

if (!M ?? false) {
    die;
}

require_once 'db.php';


if (!session_id()) session_start();

toGlobal($_POST);

$table = "attandance";

$auth = $_SESSION["auth"] ?? false;

switch (M) {
    case "add": {

        // validate auth
        if (!$auth) {
            echo json_encode(['status' => false, 'msg' => 'Authentifikasi tidak ditemukan.']);
            die;
        }

        // validate input
        $validated = validateEmptyVar("status|type|time");
        if ($validated !== true) {
            echo json_encode(['status' => false, 'msg' => "Kekurangan data required! <br>missing: $validated"]);
            die;
        }

        // check owner
        $staff_id = $auth['level'] ? $staff_id : $auth['id'];
        $salary = $auth['level'] ? $salary : "NULL";

        $date = date('Y-m-d');
        $timestamp = ((int) microtime(true)) * 1000;

        // $hours = date("H");
        // $minutes = date("i");

        // $time = "$hours : $minutes";
        // date_default_timezone_set("Asia/Jakarta");
        // $time = date("H:i");

        $query = "INSERT INTO $table SET staff_id = $staff_id, date = '$date', time = '$time', status = '$status', salary = $salary, type = '$type', timestamp = $timestamp";

        // die($query);

        $db->query($query);

        echo json_encode(['status' => true, 'msg' => 'Absen berhasil ditamahkan.']);
        break;
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

            // // filters
            // if ($filters ?? false) {
            //     $keys = explode(",", $filters);

            //     foreach ($keys as $key)
            //         $conditions[] = "$key LIKE '%$keyword%'";

            // }


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

        // Pagination
        // $total_data = (Int) $db->query("SELECT COUNT(*) $sql")->fetch_assoc()["COUNT(*)"];

        try {
            $max_data = $config['pagination']['max_data'];
        } catch (Exception $e) {
            $max_data = 5;
        }

        $page = $page < 1 ? 1 : $page;

        // $total_page = ceil($total_data / $max_data);

        // $page = $page < 0 ? 1 : ($page > $total_page ? $total_page : $page);

        $offset = ($page - 1) * $max_data;
        // $offset = $offset < 0 ? 0 : $offset;

        // $start_index = $total_data == 0 ? 0 : $offset + 1;
        // $end_index = $offset + $max_data > $total_data ? $total_data : $offset + $max_data;

        // $pagination = [
        //     'total_data' => $total_data,
        //     'max_data' => $max_data,
        //     'total_page' => $total_page,
        //     'page' => $page,
        //     'offset' => $offset,
        //     'start_index' => $start_index,
        //     'end_index' => $end_index,
        // ];

        $sql = "SELECT SQL_CALC_FOUND_ROWS a.*, s.username $sql LIMIT $offset, $max_data";

        // die($sql);

        $raw = $db->query($sql);

        $data = [];

        while ($row = $raw->fetch_assoc()) {
            $data[] = $row;
        }

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

        echo json_encode(['status' => true, 'data' => $data, 'query' => $sql, 'pagination' => $pagination, 'post' => $_POST]);
        break;
    }
    case 'get': {
        $res = $db->query("SELECT * FROM $table");

        $data = [];

        while ($row = mysqli_fetch_assoc($res)) {
            $data[] = $row;
        }

        echo json_encode(['status' => true, 'data' => $data]);
        break;
    }
    case 'edit': {

        // $id ??= false;
        // $amount ??= false;
        // $category ??= false;
        // $description ??= false;

        // if (!$id || !$amount || !$category || !$description) {
        //     echo json_encode(['status' => false, 'msg' => 'Kekurangan data required!', 'post' => $_POST]);
        //     die;
        // }


        // $db->query("UPDATE $table SET amount = '$amount', category = '$category', description = '$description' WHERE id = $id");

        // echo json_encode(['status' => true, 'msg' => 'Data Pengeluaran berhasil diubah.', 'post' => $_POST]);

        break;
    }
    case 'remove': {

        $validated = validateEmptyVar("id|staff_id");

        if ($validated !== true) {
            echo json_encode(['status' => false, 'msg' => "Kekurangan data required! <br>missing: $validated", 'post' => $_POST]);
            die;
        }
        
        // validate auth
        $_staff_id = $auth['id'];
        
        if ($_staff_id != $staff_id) {
            echo json_encode(['status' => false, 'msg' => "ID STAFF BERBEDA\nKamu tidak bisa menghapus absen orang lain.", 'post' => $_POST]);
            die;

        }

        // $id ??= false;

        // if (!$id) {
        //     echo json_encode(['status' => false, 'msg' => "Missing requied value."]);
        //     break;
        // }

        $db->query("DELETE FROM $table WHERE id='$id' AND staff_id = '$staff_id'");

        echo json_encode(['status' => true, 'msg' => 'Absen berhasil dihapus.']);
        break;
    }
    // case 'get-categories': {
    //     $query = "SELECT category FROM $table WHERE category IS NOT NULL AND category <> '' GROUP BY category";

    //     $raw = $db->query($query);
    //     $res = [];

    //     while ($row = $raw->fetch_assoc()) {
    //         $res[] = $row;
    //     }

    //     $categories = [];
    //     foreach ($res as $c) {
    //         $categories[] = $c['category'];
    //     }

    //     echo json_encode(['status' => true, 'data' => $res, 'categories' => $categories]);

    //     break;
    // }
    // case 'get-categories': {

    //     $query = "SELECT category, GROUP_CONCAT(DISTINCT subcategory SEPARATOR ',') AS subcategory FROM $table WHERE category IS NOT NULL AND category <> '' AND deprecated_code = '' GROUP BY category";

    //     $raw = $db->query($query);
    //     $res = [];

    //     while ($row = mysqli_fetch_assoc($raw)) {
    //         $row['subcategory'] = explode(',', $row['subcategory']);
    //         $res[] = $row;
    //     }

    //     $categories = [];
    //     foreach ($res as $c) {
    //         $categories[$c['category']] = $c['subcategory'];
    //     }

    //     echo json_encode(['status' => true, 'data' => $res, 'categories' => $categories]);

    //     break;
    // }
}