<?php

define("M", $_GET['m']);

if (!M ?? false) {
    die;
}

require_once 'db.php';

toGlobal($_POST);

$table = "";

switch (M) {

    case "get-revenue": {

        $sql = "SELECT 
                date,
                SUM(CASE WHEN payment_method = 'Tunai' THEN total ELSE 0 END) as tunai,
                SUM(CASE WHEN payment_method = 'Transfer' THEN total ELSE 0 END) as transfer,
                SUM(total) AS total 
            FROM transactions 
            WHERE date >= CURDATE() - INTERVAL 30 DAY
            GROUP BY date 
            ORDER BY date
        ";

        $raw = $db->query($sql);

        $revenue = 0;
        $revenues = [];

        while ($row = $raw->fetch_assoc()) {
            $revenues[] = [
                "date" => $row['date'],
                "tunai" => (int) $row['tunai'],
                "transfer" => (int) $row['transfer'],
                "total" => (int) $row['total'],
            ];

            $revenue += $row['total'] - 0;
        }

        echo json_encode([
            "status" => true,
            "revenue" => $revenue,
            "revenues" => $revenues,
        ]);

        break;
    }

    case "get-monthly-cost": {

        // $sql = "SELECT category, date, SUM(amount) AS total
        //     FROM costs
        //     WHERE date BETWEEN CURDATE() - INTERVAL 30 DAY AND CURDATE()
        //     GROUP BY category, date
        // ";

        $sql = "SELECT category, SUM(amount) AS total
            FROM costs
            WHERE date BETWEEN CURDATE() - INTERVAL 30 DAY AND CURDATE()
            GROUP BY category
        ";

        $raw = $db->query($sql);
        $monthly_costs = [];
        $monthly_cost = 0;

        while ($row = $raw->fetch_assoc()) {
            $monthly_costs[] = [
                "category" => $row["category"],
                "total" => (int) $row["total"]
            ];

            $monthly_cost += $row['total'] - 0;
        }

        echo json_encode([
            "status" => true,
            "monthly_cost" => $monthly_cost,
            "monthly_costs" => $monthly_costs,
        ]);

        break;
    }

    case "add": {

        $amount ??= false;
        $category ??= false;
        $description ??= false;

        if (!$amount || !$category || !$description) {
            echo json_encode(['status' => false, 'msg' => 'Kekurangan data required!']);
            die;
        }

        $date ??= date('Y-m-d');

        $db->query("INSERT INTO $table SET date = '$date', amount = '$amount', category = '$category', description = '$description'");

        echo json_encode(['status' => true, 'msg' => 'Data Pengeluaran berhasil ditamahkan.']);
        break;
    }
    case 'search': {

        $page ??= false;
        $page = (int) ($page ?? 1);

        $sql = " FROM $table WHERE 1 ";
        $conditions = [];

        if ($keyword ?? false) {
            // if ($description ?? false)
            //     $conditions[] = "description LIKE '%$keyword%'";

            // if ($amount ?? false)
            //     $conditions[] = "amount LIKE '%$amount%'";

            // filters
            if ($filters ?? false) {
                $keys = explode(",", $filters);

                foreach ($keys as $key) {
                    $conditions[] = "$key LIKE '%$keyword%'";
                }

            }


            if (!empty($conditions)) {
                $sql .= " AND (" . implode(' OR ', $conditions) . ")";
            }
        }

        if ($categories ?? false) {

            $arr = explode(",", $categories);
            $conditions = [];

            foreach ($arr as $cty) {
                $conditions[] = "category = '$cty'";
            }

            if (!empty($conditions)) {
                $sql .= " AND (" . implode(' OR ', $conditions) . ")";
            }

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

        $sql = "SELECT SQL_CALC_FOUND_ROWS * $sql LIMIT $offset, $max_data";


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

        echo json_encode(['status' => true, 'data' => $data, 'query' => $sql, 'pagination' => $pagination, 'post' => $_POST, 'cty' => $categories ?? false ? $categories : '']);
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

        $id ??= false;
        $amount ??= false;
        $category ??= false;
        $description ??= false;

        if (!$id || !$amount || !$category || !$description) {
            echo json_encode(['status' => false, 'msg' => 'Kekurangan data required!', 'post' => $_POST]);
            die;
        }


        $db->query("UPDATE $table SET amount = '$amount', category = '$category', description = '$description' WHERE id = $id");

        echo json_encode(['status' => true, 'msg' => 'Data Pengeluaran berhasil diubah.', 'post' => $_POST]);

        break;
    }
    case 'remove': {
        $id ??= false;

        if (!$id) {
            echo json_encode(['status' => false, 'msg' => "Missing requied value."]);
            break;
        }

        $db->query("DELETE FROM $table WHERE id='$id'");

        echo json_encode(['status' => true, 'msg' => 'Data Pengeluaran berhasil dihapus.']);
        break;
    }
    case 'get-categories': {
        $query = "SELECT category FROM $table WHERE category IS NOT NULL AND category <> '' GROUP BY category";

        $raw = $db->query($query);
        $res = [];

        while ($row = $raw->fetch_assoc()) {
            $res[] = $row;
        }

        $categories = [];
        foreach ($res as $c) {
            $categories[] = $c['category'];
        }

        echo json_encode(['status' => true, 'data' => $res, 'categories' => $categories]);

        break;
    }
}
