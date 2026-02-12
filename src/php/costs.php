<?php

define('M', $_GET['m']);

if (!M ?? false) {
    die();
}

require_once 'db.php';

toGlobal($_POST);

$table = 'costs';
$appName = 'Pengeluaran';

header('Content-Type: application/json');

try {
    switch (M) {
        case 'add':
            validateEmptyVar('amount|category|description', true, true);

            $date ??= date('Y-m-d');

            $stmt = $db->prepare("INSERT INTO $table (date, amount, category, description) VALUES (?, ?, ?, ?)");
            $stmt->bind_param('sdss', $date, $amount, $category, $description);
            $stmt->execute();

            // $db->query("INSERT INTO $table SET date = '$date', amount = '$amount', category = '$category', description = '$description'");

            die(json_encode(['status' => true, 'msg' => "$db->affected_rows Data $appName berhasil ditamahkan."]));
        case 'search':
            $page ??= false;
            $page = (int) ($page ?? 1);
            $sql = " FROM $table WHERE 1 ";
            $conditions = [];

            if ($keyword ?? false) {
                // filters
                if ($filters ?? false) {
                    $keys = explode(',', $filters);
                    foreach ($keys as $key) {
                        $conditions[] = "$key LIKE '%$keyword%'";
                    }
                }
                if (!empty($conditions)) {
                    $sql .= ' AND (' . implode(' OR ', $conditions) . ')';
                }
            }

            if ($categories ?? false) {
                $arr = explode(',', $categories);
                $conditions = [];
                foreach ($arr as $cty) {
                    $conditions[] = "category = '$cty'";
                }
                if (!empty($conditions)) {
                    $sql .= ' AND (' . implode(' OR ', $conditions) . ')';
                }
            }

            // filter date
            $date_start ??= false;
            $date_end ??= false;

            if ($date_start && $date_end) {
                $sql .= " AND (date >= '$date_start' AND date <= '$date_end') ";
            }

            $sql .= $_POST['sort_desc'] ?? false ? ' ORDER BY ID DESC ' : '';

            try {
                $max_data = $config['pagination']['max_data'];
            } catch (Exception $e) {
                $max_data = 5;
            }
            $page = $page < 1 ? 1 : $page;

            $offset = ($page - 1) * $max_data;

            $sql = "SELECT SQL_CALC_FOUND_ROWS * $sql LIMIT $offset, $max_data";

            $data = $db->query($sql)->fetch_all(MYSQLI_ASSOC);

            // Calc paginate
            $total_data = $db->query('SELECT FOUND_ROWS() AS total_data')->fetch_assoc()['total_data'];
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

            die(json_encode(['status' => true, 'data' => $data, 'query' => $sql, 'pagination' => $pagination, 'post' => $_POST, 'cty' => $categories ?? false ? $categories : '']));
        case 'get':
            $data = $db->query("SELECT * FROM $table")->fetch_all(MYSQLI_ASSOC);
            die(json_encode(['status' => true, 'data' => $data]));
        case 'edit':
            validateEmptyVar('id|amount|category|description', true, true);

            $stmt = $db->prepare("UPDATE $table (amount, category, description) VALUES (?, ?, ?) WHERE id = ?");
            $stmt->bind_param('dssi', $amount, $category, $description, $id);
            $stmt->execute();
            // $db->query("UPDATE $table SET amount = '$amount', category = '$category', description = '$description' WHERE id = $id");

            die(json_encode(['status' => true, 'msg' => 'Data Pengeluaran berhasil diubah.', 'post' => $_POST]));
        case 'remove':
            validateEmptyVar('id', true, true);
            $db->query("DELETE FROM $table WHERE id='$id'");

            die(json_encode(['status' => true, 'msg' => "$db->affected_rows Data $appName berhasil dihapus."]));
        case 'get-categories':
            $query = "SELECT category FROM $table WHERE category IS NOT NULL AND category <> '' GROUP BY category";

            $data = $db->query($query)->fetch_all(MYSQLI_ASSOC);

            $categories = [];
            foreach ($data as $c) {
                $categories[] = $c['category'];
            }

            die(json_encode(['status' => true, 'data' => $data, 'categories' => $categories]));
    }
} catch (Exception $e) {
    $err = $e->getMessage();

    die(
        json_encode([
            'status' => false,
            'msg' => $err,
            'post' => $_POST,
        ])
    );
}
