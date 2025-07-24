<?php

define("M", $_GET['m']);

if (!M ?? false) {
    die;
}

require_once 'db.php';

toGlobal($_POST);

$table = "transactions";

switch (M) {
    case "remake-transaction": {
        $validated = validateEmptyVar("id|payment_key|payment_status|total|payment_method|cart", true);

        if ($validated !== true) {
            echo json_encode(['status' => false, 'msg' => $validated, 'post' => $_POST]);
            die;
        }

        if ($payment_method !== "Transfer") {
            echo json_encode(['status' => false, 'msg' => "Methods not math!", 'post' => $_POST]);
            die;
        }

        $carts = json_decode($cart, true);

        if (!is_array($carts)) {
            echo json_encode(['status' => false, 'msg' => "Cart kosong", 'post' => $_POST]);
            die;
        }

        // validate real transaaction
        if (!$db->query("SELECT id FROM $table WHERE id = '$id'")->fetch_assoc()) {
            echo json_encode(['status' => false, 'msg' => "Transaksi tidak ditemukan!", 'post' => $_POST]);
            die;
        }

        $item_details = [];
        $profit = 0;

        foreach ($carts as $cart) {

            $sub_profit = $cart['price'] * $cart['quantity'];

            $item_details[] = [
                'id' => $cart['id'],
                'name' => $cart['name'],
                'price' => $cart['price'],
                'quantity' => $cart['quantity'],
                'sub_total' => $cart['sub_total'],
                'sub_profit' => $sub_profit,
            ];

            $profit += $sub_profit;
        }

        require_once 'midtrans.php';
        $payment_key = rand();
        $transaction_respon = createTransaction($total, $payment_key, $item_details);

        if (!$transaction_respon['status']) {
            echo json_encode([...$transaction_respon, 'post' => $_POST]);
            die;
        }

        $token = $transaction_respon['res']->token;

        // $payment_key = $transaction_respon['token'];
        $db->query("UPDATE $table SET payment_status='Pending', payment_key='$payment_key', payment_token = '$token' WHERE id ='$id'");

        echo json_encode(['status' => true, 'msg' => 'Berhasil membuat ulang transaksi.', 'transaction_respon' => $transaction_respon, 'post' => $_POST, 'item_details' => $item_details]);

        break;
    }
    case "add": {

        $date = Date('Y-m-d');
        $payment_status = 'pending';
        $payment_key = '';

        $total = $_POST['total'] ?? false;
        $payment_method = $_POST['payment_method'] ?? false;

        if (!$total || !$payment_method) {
            echo json_encode(['staus' => false, 'msg' => 'Missing required value!', 'post' => $_POST]);
            die;
        }

        $carts = json_decode($_POST['cart'] ?? [], true);

        if (!$carts || !is_array($carts)) {
            echo json_encode(['status' => false, 'msg' => 'Cart kosong!', 'post' => $_POST]);
            die;
        }

        $transaction_respon = [];
        $item_details = [];

        $profit = 0;

        foreach ($carts as $cart) {

            $sub_profit = $cart['price'] * $cart['quantity'];

            $item_details[] = [
                'id' => $cart['id'],
                'name' => $cart['name'],
                'price' => $cart['price'],
                'quantity' => $cart['quantity'],
                'sub_total' => $cart['sub_total'],
                'sub_profit' => $sub_profit,
            ];

            $profit += $sub_profit;
        }

        // echo json_encode($item_details);
        // die;

        switch ($payment_method) {
            case 'Tunai': {
                $db->query("INSERT INTO $table SET date='$date', total=$total, profit = $profit, payment_status='Belum dibayar', payment_method='$payment_method', payment_key=''");
                break;
            }
            case 'Transfer': {

                require_once 'midtrans.php';
                $payment_key = rand();
                $transaction_respon = createTransaction($total, $payment_key, $item_details);

                if (!$transaction_respon['status']) {
                    echo json_encode([...$transaction_respon, 'post' => $_POST]);
                    die;
                }

                $token = $transaction_respon['res']->token;

                // $payment_key = $transaction_respon['token'];
                $db->query("INSERT INTO $table SET date='$date', total=$total, profit = $profit, payment_status='Pending', payment_method='$payment_method', payment_key='$payment_key', payment_token = '$token'");
                break;

            }

            default: {
                echo json_encode(['status' => false, 'msg' => 'Invalid payment Method']);
                die;
            }
        }

        $transaction_id = $db->insert_id;

        $num = 0;

        $sql = "INSERT INTO transaction_details (transaction_id, product_id, quantity, sub_total, sub_profit) VALUES ";

        $queries = [];
        foreach ($carts as $cart) {
            $product_id = $cart['id'];
            $quantity = $cart['quantity'];
            $sub_total = $cart['sub_total'];

            $sub_profit = $cart['price'] * $cart['quantity'];

            $queries[] = " ('$transaction_id', '$product_id', '$quantity', '$sub_total', '$sub_profit') ";
            $num++;
        }

        if (!empty($queries)) {
            $sql .= implode(", ", $queries);
        }

        $db->query($sql);

        $affected_rows = $db->affected_rows;

        echo json_encode(['status' => true, 'msg' => 'Berhasil menambahkan transaksi.', 'affected_rows' => $affected_rows, 'queries' => $queries, 'transaction_id' => $transaction_id, 'transaction_respon' => $transaction_respon, 'post' => $_POST, 'item_details' => $item_details, 'urlData' => encodeKey($transaction_id)]);

        break;
    }
    case 'search': {

        $page ??= false;
        $page = (Int) ($page ?? 1);
        $keyword ??= false;

        $payment_methods ??= false;
        $payment_statuses ??= false;

        $sql = " FROM $table t JOIN transaction_details td ON t.id = td.transaction_id JOIN products p ON td.product_id = p.id WHERE 1=1 ";
        $conditions = [];

        if ($keyword) {
            if ($name ?? false)
                $conditions[] = "t.name LIKE '%$keyword%'";

            if ($payment_status ?? false)
                $conditions[] = "t.payment_status LIKE '%$keyword%'";

        }

        if (!empty($conditions))
            $sql .= " AND (" . implode(' OR ', $conditions) . ")";


        // Filter paymet_methods
        $payment_method_conditions = [];
        if ($payment_methods) {
            $arr = explode(',', $payment_methods);

            foreach ($arr as $pm) {
                $payment_method_conditions[] = "t.payment_method = '$pm'";
            }

            if (!empty($payment_method_conditions)) {
                $sql .= " AND (" . implode(' OR ', $payment_method_conditions) . ")";
            }
        }

        // Filter paymet_statuses
        $payment_status_conditions = [];
        if ($payment_statuses) {
            $arr = explode(',', $payment_statuses);

            foreach ($arr as $ps) {
                $payment_status_conditions[] = "t.payment_status = '$ps'";
            }

            if (!empty($payment_status_conditions)) {
                $sql .= " AND (" . implode(' OR ', $payment_status_conditions) . ")";
            }
        }


        // Filter date
        $date_start ??= false;
        $date_end ??= false;

        // $date_start = datePickerToDate($date_start);
        // $date_end = datePickerToDate($date_end);

        if ($date_start && $date_end) {
            $sql .= " AND (t.date >= '$date_start' AND t.date <= '$date_end') ";
        }

        // $sql .= $sort_desc ?? false ? " ORDER BY ID DESC " : "";

        // Pagination
        // $query_page = "SELECT COUNT(*) AS total_row FROM $table";
        // $query_page = "SELECT COUNT(*) AS total_row " . $sql . " GROUP BY t.id";
        // $total_data = (Int) $db->query($query_page)->fetch_assoc()["total_row"];
        // echo "(t) $total_data (t)";
        // die;
        // die($total_data);
        $max_data = 5;
        // $total_page = ceil($total_data / $max_data);

        $page = $page < 0 ? 1 : $page;

        $offset = ($page - 1) * $max_data;
        $offset = $offset < 0 ? 0 : $offset;

        $sql = "SELECT SQL_CALC_FOUND_ROWS t.*, GROUP_CONCAT(
		    CONCAT(
			    '{',
				    '\"name\": \"', p.name, '\", ',
                    '\"id\": ', td.id, ', ',
					'\"price\": ', p.price, ', ',
					'\"purchase_price\": ', p.purchase_price, ', ',
					'\"quantity\": ', td.quantity, ', ',
					'\"sub_total\": ', td.sub_total, ', ',
                    '\"profit\": ', ((p.price - p.purchase_price) * td.quantity), ', ',
                    '\"product\": {',
                        '\"id\": ', p.id, ', ',
                        '\"name\": \"', p.name, '\", ',
                        '\"purchase_price\": ', p.purchase_price, ', ',
                        '\"price\": ', p.price, ', ',
                        '\"image\": \"', p.image, '\", ',
                        '\"category\": \"', p.category, '\", ',
                        '\"subcategory\": \"', p.subcategory, '\", ',
                        '\"deprecated_code\": \"', p.deprecated_code, '\"',
                    '}',
				'}'
			)
		) AS transaction_details, 
        SUM((p.price - p.purchase_price) * td.quantity) AS profit
        
        " . $sql . " GROUP BY t.id " . ($sort_desc ?? false ? 'ORDER BY id DESC' : '') . " LIMIT $offset, $max_data";
        // $sql = "SELECT SQL_CALC_FOUND_ROWS t.*, GROUP_CONCAT(
        //     CONCAT(
        // 	    '{',
        // 		    '\"name\": \"', p.name, '\", ',
        // 			'\"price\": ', p.price, ', ',
        // 			'\"purchase_price\": ', p.purchase_price, ', ',
        // 			'\"quantity\": ', td.quantity, ', ',
        // 			'\"sub_total\": ', td.sub_total, ', ',
        //             '\"profit\": ', ((CAST(p.price AS SIGNED) - CAST(p.purchase_price AS SIGNED)) * CAST(td.quantity AS SIGNED)), ', ',
        //             '\"product\": {',
        //                 '\"id\": ', p.id, ', ',
        //                 '\"name\": \"', p.name, '\", ',
        //                 '\"purchase_price\": ', p.purchase_price, ', ',
        //                 '\"price\": ', p.price, ', ',
        //                 '\"image\": \"', p.image, '\", ',
        //                 '\"category\": \"', p.category, '\", ',
        //                 '\"subcategory\": \"', p.subcategory, '\", ',
        //                 '\"deprecated_code\": \"', p.deprecated_code, '\"',
        //             '}',
        // 		'}'
        // 	)
        // ) AS transaction_details, 
        // SUM((CAST(p.price AS SIGNED) - CAST(p.purchase_price AS SIGNED)) * CAST(td.quantity AS SIGNED)) AS profit

        // " . $sql . " GROUP BY t.id " . ($sort_desc ?? false ? 'ORDER BY id DESC' : '') . " LIMIT $offset, $max_data";

        // echo $sql;
        // die;


        $res = $db->query($sql);

        $data = [];

        while ($row = mysqli_fetch_assoc($res)) {
            $row['td'] = $row['transaction_details'];
            $row['transaction_details'] = json_decode('[' . $row['transaction_details'] . ']', true);

            if ($row['payment_key'] ?? false)
                $row['data_url'] = encodeKey2($row['id']);

            $data[] = $row;

        }


        // Calc paginate
        $total_data = $db->query("SELECT FOUND_ROWS() AS total_data")->fetch_assoc()['total_data'];
        $total_page = ceil($total_data / $max_data);

        // $page = $page < 0 ? 1 : ($page > $total_page ? $total_page : $page);

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
        $raw = $db->query("SELECT * FROM $table");

        $data = [];
        while ($row = mysqli_fetch_assoc($raw))
            $data[] = $row;

        echo json_encode(['status' => true, 'data' => $data]);

        break;
    }
    case 'edit': {

        $id = $_POST['id'] ?? false;
        $payment_method = $_POST['payment_method'] ?? false;
        $payment_status = $_POST['payment_status'] ?? false;

        $prev_payment_method = $_POST['prev_payment_method'] ?? false;
        $prev_payment_status = $_POST['prev_payment_status'] ?? false;

        if (!$id || !$payment_method || !$payment_status || !$prev_payment_method || !$prev_payment_status) {
            echo json_encode(['staus' => false, 'msg' => 'Missing required value!', 'post' => $_POST]);
            die;
        }

        $db->query("UPDATE $table SET payment_method='$payment_method', payment_status='$payment_status' WHERE id = $id");

        echo json_encode([
            'status' => true,
            'msg' => 'Transaksi berhasil diubah.'
        ]);

        break;
    }
    case 'remove': {
        $id = $_POST['id'] ?? false;

        if (!$id) {
            echo json_encode(['status' => false, 'msg' => 'Kekurangan data required!']);
            die;
        }

        $db->query("DELETE FROM $table WHERE id='$id'");

        echo json_encode(['status' => true, 'msg' => 'Transaksi berhasil dihapus.']);

        break;
    }
    case 'pay': {

        // Hapus method ini nanti atau khusus admin
        $encode = $_GET['data'] ?? false;

        if (!$encode)
            die("Invalid data!");

        $decoded = decodeKey2($encode);

        if (!$decoded)
            die("Invalid data!");

        $raw = $db->query("
		    SELECT IDR(t.total) AS total, GROUP_CONCAT(
			    CONCAT(
				    '{', 
					    '\"name\": \"', p.name,
						'\", \"price\": \"', IDR(p.price),
						'\", \"quantity\": \"', td.quantity,
						'\", \"sub_total\": \"', IDR(td.sub_total), '\"',
					'}'
				)
			) AS transaction_details
			FROM transactions t
			JOIN transaction_details td ON t.id = td.transaction_id
			JOIN products p ON td.product_id = p.id
			WHERE t.id = '$decoded'
			GROUP BY t.id
		");

        $res = [];

        while ($raw = mysqli_fetch_assoc($raw)) {
            $raw['transaction_details'] = json_decode('[' . $raw['transaction_details'] . ']', true);
            $res = $raw;
            break;
        }


        // echo json_encode(['res' => $res]);

        if (empty($res))
            die;

        require_once 'midtrans.php';



        break;
    }
    case 'check-status': {
        $validated = validateEmptyVar('payment_key', true);

        if ($validated !== true) {
            echo json_encode(['status' => false, 'msg' => $validated, 'post' => $_POST, 'res' => $res]);
            die;
        }

        $key = $payment_key;

        $raw = $db->query("SELECT * FROM $table WHERE payment_key='$key' LIMIT 1");
        $res = [];

        while ($row = mysqli_fetch_assoc($raw)) {
            $res = $row;
            break;
        }

        if (empty($res)) {
            echo json_encode(['status' => false, 'msg' => "MISING DATA!", 'post' => $_POST, 'res' => $res]);
            die;

        }
        // echo json_encode(['status' => false, 'msg' => "CUKUP DATA", 'post' => $_POST, 'res' => $res]);
        // die;

        include_once 'midtrans.php';

        $rawStatus = getTransactionStatus($key);

        if (!$rawStatus['status']) {
            echo json_encode(['status' => false, 'msg' => "status atau transaksi tidak ditemukan atau metode transaksi belum dipilih!", 'post' => $_POST, 'raw_status' => $rawStatus]);
            die;
        }

        $prev_status = $res['payment_status'];
        $status = ucfirst($rawStatus['data']['transaction_status']);
        $id = $res['id'];

        if ($prev_status == $status) {
            echo json_encode(['status' => false, 'msg' => "Tidak ada perubahan status.", 'post' => $_POST]);
            die;
        }

        $db->query("UPDATE $table SET payment_status='$status' WHERE id='$id'");

        echo json_encode(['status' => true, 'msg' => "Transaksi berhasil di ubah dari '$prev_status' ke '$status'"]);

        break;
    }
    case 'get-payment-methods': {
        $query = "SELECT payment_method, GROUP_CONCAT(DISTINCT payment_status SEPARATOR ',') AS payment_statuses FROM $table WHERE payment_method IS NOT NULL AND payment_method <> '' GROUP BY payment_method";

        $raw = $db->query($query);
        $res = [];

        while ($row = $raw->fetch_assoc()) {
            $row['payment_statuses'] = explode(',', $row['payment_statuses']);
            $res[] = $row;
        }

        $payment_methods = [];
        foreach ($res as $c) {
            $payment_methods[$c['payment_method']] = $c['payment_statuses'];
        }

        echo json_encode(['status' => true, 'data' => $res, 'payment_methods' => $payment_methods]);
        break;
    }

    case 'transaction-status-to-bayar': {

        $id ??= false;

        if (!$id) {
            echo json_encode(['status' => false, 'msg' => 'Missing required value!']);
            die;
        }

        $query = "UPDATE $table SET payment_status = 'Sudah dibayar' WHERE id = $id";

        // die($query);

        $db->query($query);

        $affected_rows = $db->affected_rows;
        echo json_encode(['status' => true, 'msg' => 'Berhail mengubah status transaksi menjadi Sudah dibayar.']);
        break;

    }

}