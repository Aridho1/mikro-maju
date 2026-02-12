<?php

define('M', $_GET['m']);

if (!M ?? false) {
    die();
}

require_once 'db.php';

toGlobal($_POST);

$table = 'stock_adjustments';
$table_product = 'products';
$item = 'Stock';

header('Content-Type: application/json');

try {
    switch (M) {
        case 'search':
            $page ??= false;
            $page = (int) ($page ?? 1);
            $keyword ??= false;
            $filters ??= false;

            validateEmptyVar('product_id', true, true);

            $query = " FROM $table WHERE product_id = {$product_id}";

            if ($reasons ?? false) {
                $conditions = [];

                foreach (explode(',', $reasons) as $reason) {
                    $conditions[] = " reason=$reason ";
                }

                if (!empty($conditions)) {
                    $query .= ' AND (' . implode(' OR ', $conditions) . ')';
                }
            }

            $query .= ' ORDER BY id DESC ';

            // Pagination
            $total_data = (int) $db->query("SELECT COUNT(*) $query")->fetch_assoc()['COUNT(*)'];
            try {
                $max_data = $config['pagination']['max_data'];
            } catch (Exception $e) {
                $max_data = 5;
            }
            $total_page = ceil($total_data / $max_data);

            $page = $page < 0 ? 1 : ($page > $total_page ? $total_page : $page);

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

            $query = "SELECT * $query LIMIT $offset, $max_data";
            $res = $db->query($query)->fetch_all(MYSQLI_ASSOC);

            die(
                json_encode([
                    'status' => true,
                    'data' => $res,
                    'pagination' => $pagination,
                ])
            );

        // A-G-E-R METHOD | ADD GET EDIT REMOVE
        case 'add':
            validateEmptyVar('product_id|quantity|reason|note', true, true);

            $db->begin_transaction();

            $stmt = $db->prepare("INSERT INTO $table (product_id, quantity, reason, note) VALUES (?, ?, ?, ?)");
            $stmt->bind_param('iiss', $product_id, $quantity, $reason, $note);
            $stmt->execute();

            $contextStoct = 0;
            $query_part = '';

            switch ($reason) {
                case 'EXPIRED':
                case 'DAMAGED':
                    // $contextStoct = $quantity <= 0 ? $quantity : $quantity * -1;
                    $contextStoct = $quantity <= 0 ? $quantity * -1 : $quantity;
                    // $query_part = "stock = stock - {$contextStoct} ";
                    // $query_part = 'stock = stock - ? ';
                    $query_part = "stock = stock - {$contextStoct} ";
                    break;
                // case 'MANUAL':
                //     $contextStoct = $quantity <= 0 ? $quantity * -1 : $quantity;
                //     // $query_part = "stock = stock - {$contextStoct} ";
                //     // $query_part = 'stock = stock - ? ';
                //     $query_part = "stock = stock - {$contextStoct} ";
                //     break;
                case 'MANUAL':
                case 'OPNAME':
                    $contextStoct = $quantity;
                    $operand = $contextStoct <= 0 ? '-' : '+';
                    // $query_part = "stock = stock {$operand} {$contextStoct} ";
                    // $query_part = "stock = stock {$operand} ? ";
                    $query_part = "stock = stock {$operand} {$contextStoct} ";
                    break;
                default:
                    throw new Exception('invalid reason!');
            }

            // $stmt = $db->prepare("UPDATE {$table} SET {$query_part}");
            // $stmt = $db->prepare("UPDATE ? SET {$query_part}");
            // $stmt = $db->prepare("UPDATE $table_product SET {$query_part}");
            $stock_query = "UPDATE $table_product SET {$query_part} WHERE id = {$product_id}";
            $db->query($stock_query);
            // $stmt = $db->prepare("UPDATE ? SET {$query_part}");
            // $stmt->bind_param('si', $table, $contextStoct);
            // $stmt->execute();
            // die(
            //     json_encode([
            //         'status' => false,
            //         // 'msg' => "{$db->affected_rows} {$item} berhasil ditambahkan.",
            //         // 'msg' => "{$item} berhasil ditambahkan.",
            //         'msg' => $stock_query,
            //         'stock_query' => $stock_query,
            //         'post' => $_POST,
            //     ])
            // );

            // get current stock
            $current_stock = $db->query("SELECT stock FROM $table_product WHERE id = $product_id")->fetch_assoc()['stock'];

            $db->commit();

            die(
                json_encode([
                    'status' => true,
                    // 'msg' => "{$db->affected_rows} {$item} berhasil ditambahkan.",
                    'msg' => "{$item} berhasil ditambahkan.",
                    'stock_query' => $stock_query,
                    'post' => $_POST,
                    'current_stock' => $current_stock,
                ])
            );

        case 'get-stocks-by-product-id':
            // die('duar');
            validateEmptyVar('id', true, true);

            $query = "SELECT * FROM $table WHERE product_id = $id ORDER BY id DESC";
            $data = $db->query($query)->fetch_all(MYSQLI_ASSOC);

            die(
                json_encode([
                    'status' => true,
                    'data' => $data,
                ])
            );
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
