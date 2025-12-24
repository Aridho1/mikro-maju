<?php

define("M", $_GET['m']);

if (!M ?? false) {
    die;
}

require_once 'db.php';

toGlobal($_POST);

$table = "products";
$appName = "Produk";
$view_name = "view_products_with_discount";

header("Content-Type: application/json");

try {
    switch (M) {
        case "add": {
            validateEmptyVar("name|purchase_pricse|price|category", true, true);

            $uplodedFile = uploadFile('image', './../img/db/');

            if ($_FILES['image']['error'] ?? false == 4) {
                $image = 'default.jpg';
            } else if (!$uplodedFile['status']) {
                throw new Exception($uplodedFile['msg'] ?? "Gambar error atau tidak ditemukan!");
            } else
                $image = $uplodedFile['data'];

            $stmt = $db->prepare("INSERT INTO $table (name, purchase_price, price, image, category, subcategory, deprecated_code, origin_id) VALUES (?, ?, ?, ?, ?, NULL, 0, 0)");
            $stmt->bind_param("sddss", $name, $purchase_price, $price, $image, $category);
            $stmt->execute();
            // $query = "INSERT INTO $table SET name = '$name', purchase_price = '$purchase_price', price = '$price', image = '$image', category = '$category', subcategory = '', deprecated_code = 0, origin_id = 0";

            // // die($query);

            // $db->query($query);

            die(json_encode(['status' => true, 'msg' => "$db->affected_rows Data $appName berhasil ditamahkan."]));
        }

        case 'search-v2': {
            $page ??= false;
            $page = (Int) ($page ?? 1);
            $keyword ??= false;
            $filters ??= false;
        
            $sql = " FROM $view_name WHERE deprecated_code = '' ";
            
            if ($keyword) {
                $conditions = [];

                $filters = explode(",", $filters);

                foreach ($filters as $key) {
                    $conditions[] = "$key LIKE '%$keyword%'";
                }

                if (!empty($conditions))
                    $sql .= " AND (" . implode(' OR ', $conditions) . ")";
            }

            // categories dynamic
            $categories_conditions = [];
            foreach ($_POST as $key_name => $value) {
                $splited_key = explode("categories_", $key_name);

                if (count($splited_key) == 1 || empty($value))
                    continue;

                $key = $splited_key[1];

                $conditions = [];

                $values = explode(",", $value);
                foreach ($values as $val) {
                    $conditions[] = "subcategory = '$val'";
                }

                $categories_conditions[] = "category = '$key' AND (" . implode(" OR ", $conditions) . ")";
            }

            if (!empty($categories_conditions)) {
                $sql .= " AND ( " . implode(" OR ", $categories_conditions) . ")";
            }


            $sql .= $_POST['sort_desc'] ?? false ? " ORDER BY ID DESC " : "";

            // Pagination
            $total_data = (Int) $db->query("SELECT COUNT(*) $sql")->fetch_assoc()["COUNT(*)"];
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

            $sql = "SELECT * " . $sql . "LIMIT $offset, $max_data";

            $data = $db->query($sql)->fetch_all(MYSQLI_ASSOC);

            die(json_encode(['status' => true, 'data' => $data, 'query' => $sql, 'pagination' => $pagination, 'post' => $_POST]));
        }

        case 'search': {
            $page ??= false;
            $page = (Int) ($page ?? 1);
            $keyword ??= false;
            $filters ??= false;

            $sql = " FROM $table WHERE deprecated_code = '' ";

            if ($keyword) {
                $conditions = [];

                $filters = explode(",", $filters);

                foreach ($filters as $key) {
                    $conditions[] = "$key LIKE '%$keyword%'";
                }

                // if ($name ?? false)
                //     $conditions[] = "name LIKE '%$keyword%'";

                // if ($purchase_price ?? false)
                //     $conditions[] = "purchase_price LIKE '%$keyword%'";

                // if ($price ?? false)
                //     $conditions[] = "price LIKE '%$keyword%'";

                // if ($category ?? false)
                //     $conditions[] = "category LIKE '%$keyword%'";

                // if ($subcategory ?? false)
                //     $conditions[] = "subcategory LIKE '%$keyword%'";

                if (!empty($conditions))
                    $sql .= " AND (" . implode(' OR ', $conditions) . ")";
            }

            // categories dynamic
            $categories_conditions = [];
            foreach ($_POST as $key_name => $value) {
                $splited_key = explode("categories_", $key_name);

                if (count($splited_key) == 1 || empty($value))
                    continue;

                $key = $splited_key[1];

                $conditions = [];

                $values = explode(",", $value);
                foreach ($values as $val) {
                    $conditions[] = "subcategory = '$val'";
                }

                $categories_conditions[] = "category = '$key' AND (" . implode(" OR ", $conditions) . ")";
            }

            if (!empty($categories_conditions)) {
                $sql .= " AND ( " . implode(" OR ", $categories_conditions) . ")";
            }


            $sql .= $_POST['sort_desc'] ?? false ? " ORDER BY ID DESC " : "";

            // Pagination
            $total_data = (Int) $db->query("SELECT COUNT(*) $sql")->fetch_assoc()["COUNT(*)"];
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

            $sql = "SELECT * " . $sql . "LIMIT $offset, $max_data";

            $data = $db->query($sql)->fetch_all(MYSQLI_ASSOC);

            die(json_encode(['status' => true, 'data' => $data, 'query' => $sql, 'pagination' => $pagination, 'post' => $_POST]));
        }
        case 'get': {
            $data = $db->query("SELECT * FROM $table")->fetch_all(MYSQLI_ASSOC);
            die(json_encode(['status' => true, 'data' => $data]));
        }
        case 'get-views': {
            $data = $db->query("SELECT * FROM $view_name WHERE deprecated_code = ''")->fetch_all(MYSQLI_ASSOC);
            die(json_encode(['status' => true, 'data' => $data]));
        }
        case 'edit': {
            // $id ??= false;
            // $name ??= false;
            // // $description ??= false;
            // $price ??= false;
            // $prevImage = $_POST['prev-image'] ?? false;
            // $purchase_price ??= false;
            // $category ??= false;
            // // $subcategory ??= false;

            // $prevPrice ??= false;
            // $prevPurchasePrice ??= false;

            // $prev_id ??= false;
            // $prev_origin_id ??= false;

            // $validated = validateEmptyVar(str: "id|name|price|prevImage|prevPrice|prevPurchasePrice|category|prev_id|prev_origin_id");

            // // if (!$id || !$name || !$description || !$price || !$prevImage || !$prevPrice || !$prevPurchasePrice || !$category || !$subcategory || !$prev_id || !$prev_origin_id) {
            // if ($validated !== true) {
            //     echo json_encode(['status' => false, 'msg' => "Kekurangan data required! <br>missing: $validated", 'post' => $_POST]);
            //     die;
            // }

            validateEmptyVar("id|name|category|purchase_price|price|prevImage|prevPrice|prevPurchasePrice|prev_id|prev_origin_id", true, true);

            $uplodedFile = uploadFile('image', './../img/db/');

            // didn edit image
            if ($_FILES['image']['error'] == 4) {
                $image = $prevImage;

                // filter 
            } else if (!$uplodedFile['status']) {
                throw new Exception($uplodedFile['msg'] ?? "Gambar error atau tidak ditemukan!");
                // echo json_encode($uplodedFile);
                // die;
            } else
                $image = $uplodedFile['data'];


            // Handle edit calc price & purchase price
            $isEditAnyway = true;
            $total_data = false;

            if ($prevPrice != $price || $prevPurchasePrice != $purchase_price) {

                $total_data = $db->query("SELECT COUNT(*) AS total_data FROM transaction_details WHERE product_id = $id")->fetch_assoc()['total_data'];

                // Handle deprecated | legacy
                if ($total_data) {
                    $isEditAnyway = false;
                    $curr_origin_id = $prev_origin_id == "0" ? $prev_id : $prev_origin_id;

                    // Edit prev data to deprecated
                    $db->query("UPDATE $table SET deprecated_code = 1, origin_id = CASE WHEN origin_id = 0 THEN $prev_id ELSE origin_id END WHERE id = $prev_id");

                    // Add edited product as new product
                    $db->query("INSERT INTO $table SET name = '$name', purchase_price = '$purchase_price', price = '$price', category = '$category', image = '$image', origin_id = $curr_origin_id");
                }
            }

            if ($isEditAnyway)
                $db->query("UPDATE $table SET name = '$name', purchase_price = '$purchase_price', price = '$price', category = '$category', image = '$image' WHERE id = '$id'");

            die(json_encode(['status' => true, 'msg' => "$db->affected_rows Data $appName berhasil diubah,", 'post' => $_POST, 'isEditAnyway' => $isEditAnyway, 'total_data' => $total_data]));
        }
        case 'remove': {
            validateEmptyVar("id|origin_id", true, true);

            // Handle deprecated | legacy
            if ($db->query("SELECT COUNT(*) AS total_data FROM transaction_details WHERE product_id = $id")->fetch_assoc()['total_data'] == 0)
                $db->query("DELETE FROM $table WHERE id='$id' ");

            else {
                $query = "UPDATE $table SET deprecated_code = 2 WHERE (origin_id = 0 AND id = $id) OR (origin_id != 0 AND origin_id = $origin_id)";
                // die($query);
                $db->query($query);
            }

            die(json_encode(['status' => true, 'msg' => 'Item berhasil dihapus.']));
        }
        case 'get-categories': {

            $query = "SELECT category, GROUP_CONCAT(DISTINCT subcategory SEPARATOR ',') AS subcategory FROM $table WHERE category IS NOT NULL AND category <> '' AND deprecated_code = '' GROUP BY category";

            $raw = $db->query($query);
            $res = [];

            while ($row = $raw->fetch_assoc()) {
                $row['subcategory'] = explode(',', $row['subcategory'] ?? '');
                $res[] = $row;
            }

            $categories = [];
            foreach ($res as $c) {
                $categories[$c['category']] = $c['subcategory'];
            }

            echo json_encode(['status' => true, 'data' => $res, 'categories' => $categories]);

            break;
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