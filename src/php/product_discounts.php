<?php

define("M", $_GET['m']);

if (!M ?? false) {
    die;
}

require_once 'db.php';

toGlobal($_POST);

$table = "product_discounts";
$item = "Diskon";

header("Content-Type: application/json");

try {
    switch (M) {
        case "search": {
            $page ??= false;
            $page = (Int) ($page ?? 1);
            $keyword ??= false;
            $filters ??= false;
            
            $query = " FROM $table WHERE flag_active=1 ";
            
            if ($type ?? false) {
                $conditions = [];
                
                foreach (explode(",", $type) as $type) {
                    $conditions[] = " type=$type ";
                }
                
                if (!empty($conditions)) {
                    $query .= " AND (" . implode(' OR ', $conditions) . ")";
                }
            }
            
            $query .= " ORDER BY id DESC ";
            // $query .= $sort_desc ?? false ? " ORDER BY id DESC " : "";
            // Pagination
            $total_data = (Int) $db->query("SELECT COUNT(*) $query")->fetch_assoc()["COUNT(*)"];
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
            
            die(json_encode([
                "status" => true,
                "data" => $res,
            ]));
        }
        
        // A-G-E-R METHOD | ADD GET EDIT REMOVE
        case "add": {
            validateEmptyVar("product_id|type|value", true, true);
            
            $isActiveNow = isDiscountActiveNow($start_date, $end_date, 1);

            // validate double discount
            // if ($db->query("SELECT id FROM $table WHERE product_id=$product_id AND flag_active = 1 AND is_active = 1")->fetch_assoc()) {
            if ($isActiveNow && $db->query("SELECT id FROM $table WHERE product_id=$product_id AND flag_active = 1 AND is_active = 1 AND (start_date IS NULL OR start_date <= CURDATE()) AND (end_date IS NULL OR end_date >= CURDATE())")->fetch_assoc()) {
                throw new Exception("Masih ada diskon yang aktif!!!");
            }

            $start_date = empty($start_date) ? null : $start_date;
            $end_date = empty($end_date) ? null : $end_date;
            // $start_date ??= null;
            // $end_date ??= null;
            
            // var_dump([$start_date, $end_date, null]);
            // die;
            // throw new Exception(json_encode(['start_date' => $start_date, 'end_date' => $end_date]));

            $stmt = $db->prepare("INSERT INTO $table (product_id, type, value, start_date, end_date) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("isdss", $product_id, $type, $value, $start_date, $end_date);
            $stmt->execute();
            
            // $start_date ??= "'NULL'";
            // $end_date ??= "'NULL'";

            
            // $query = "INSERT INTO $table SET product_id=$product_id, type='$type', value='$value', start_date=$start_date, end_date=$end_date";
            // throw new Exception($query);
            
            // $db->query($query);

            
            
            die(json_encode([
                "status" => true,
                "msg" => "$db->affected_rows $item berhasil ditambahkan.",
                "isActiveNow" => $isActiveNow,
            ]));
        }
    
        case "remove": {
            validateEmptyVar("id", true, true);
            $query = "DELETE FROM $table WHERE id=$id";
            
            // $query = "UPDATE $table SET flag_active=0 WHERE id=$id";

            try {
                $db->query($query);
            } catch (mysqli_sql_exception $e) {
                // RESTRICT ERROR
                if ($e->getCode() == 1451) {
                    throw new Exception("Diskon tidak bisa dihapus karena sudah digunakan pada transaksi");
                }

                throw $e;
            }
            
            
            // die(json_encode([
            //     "status" => true,
            //     "msg" => "$db->affected_rows $item berhasil dihapus.",
            // ]));
        }
        
        // other api
        case "stop-discount": {
            validateEmptyVar("id", true, true);
            $query = "UPDATE $table SET is_active=0 WHERE id=$id";
            
            $db->query($query);
            
            die(json_encode([
                "status" => true,
                "msg" => "$db->affected_rows $item berhasil distop.",
            ]));
        }
/*
SELECT *,
	CASE
		WHEN is_active = 0 THEN 'disabled'
		WHEN start_date IS NOT NULL AND start_date > CURDATE() THEN 'scheduled'
		WHEN end_date IS NOT NULL AND end_date < CURDATE() THEN 'expired'
		ELSE 'active'
	END AS status
FROM product_discounts
WHERE product_id = ?
ORDER BY id DESC;


SELECT *,
    CASE
        WHEN is_active = 0 THEN 'disabled'
        WHEN start_date IS NOT NULL AND start_date > CURDATE() THEN 'scheduled'
        WHEN end_date IS NOT NULL AND end_date < CURDATE() THEN 'expired'
        ELSE 'active'
    END AS status
FROM product_discounts
WHERE product_id = ?
ORDER BY id DESC;


SELECT *,
    CASE
        WHEN is_active = 0 THEN 'disabled'

        WHEN start_date IS NOT NULL 
             AND start_date > CURDATE()
             THEN 'upcoming'

        WHEN end_date IS NOT NULL 
             AND end_date < CURDATE()
             THEN 'expired'

        ELSE 'active'
    END AS status
FROM product_discounts
WHERE product_id = ?
ORDER BY id DESC;

*/

        case "get-discounts-by-product-id": {
            validateEmptyVar("id", true, true);

            // $query = "SELECT * FROM $table WHERE product_id=$id AND flag_active=1 ORDER BY ID DESC";
            $query = "
                SELECT *,
                    CASE
                        WHEN is_active = 0 THEN 'disabled'
                        WHEN start_date IS NOT NULL AND start_date > CURDATE() THEN 'scheduled'
                        WHEN end_date IS NOT NULL AND end_date < CURDATE() THEN 'expired'
                        ELSE 'active'
                    END AS status
                FROM $table
                WHERE product_id = $id
                ORDER BY id DESC
            ";
            
            $data = $db->query($query)->fetch_all(MYSQLI_ASSOC);

            die(json_encode([
                "status"=> true,
                "data"=> $data,
            ]));
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
