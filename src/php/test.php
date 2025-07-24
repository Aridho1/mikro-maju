<?php

use Dom\AdjacentPosition;

// echo  json_encode(['data' => explode('duara', 'duar-meledak-3')]);

include_once 'db.php';

// $key = '777';

// $encoded = encodeKey2($key);
// $decoded = decodeKey2($encoded);
// $test = base64_decode($encoded);
// // $test = base64_decode($test);

// echo json_encode(['key' => $key, 'encoded' => $encoded, 'decoded' => $decoded, 'test' => $test]);

// $sql = "SELECT t.*, GROUP_CONCAT(
// 		    CONCAT(
// 			    '{',
// 				    '\"name\": \"', p.name,
// 					'\", \"price\": \"', p.price,
// 					'\", \"quantity\": \"', td.quantity,
// 					'\", \"sub_total\": \"', td.sub_total, '\"',
// 				'}'
// 			)
// 		) AS transaction_details " . $sql . " GROUP BY t.id LIMIT $offset, $max_data";

// $query =
//     "SELECT category, GROUP_CONCAT(CONCAT('\"', subcategory, '\"')) AS subcategory
//     FROM products GROUP BY category
// ";

// $query =
//     "SELECT category, GROUP_CONCAT(DISTINCT subcategory SEPARATOR ',') AS subcategory_str,
//     CONCAT('[', GROUP_CONCAT(DISTINCT subcategory SEPARATOR ','), ']') AS subcategory
//     FROM products WHERE category IS NOT NULL AND category <> '' GROUP BY category
// ";
// $raw = $db->query($query);

// $res = [];

// while ($row = mysqli_fetch_assoc($raw)) {
//     // $row['subcategory3'] = json_decode($row['subcategory'], true);
//     $row['subcategory4'] = explode(',', $row['subcategory_str']);
//     // $row['sub_category2'] = json_decode('[' . $row['subcategory'] . ']', true);
//     $res[] = $row;
//     // break;
// }

// echo json_encode($res);

// var_dump(explode('-', 'abcd'));





// toGlobal($_GET);

// $name ??= '';

// $res = [];

// $raw = $db->query("SELECT SQL_CALC_FOUND_ROWS name FROM products WHERE name LIKE '%$name%' LIMIT 2");

// while ($row = $raw->fetch_assoc()) {
//     $res[] = $row;
// }

// $rows = $db->query("SELECT FOUND_ROWS() AS total_data")->fetch_assoc()['total_data'];

// echo json_encode(['res' => $res, 'rows' => $rows]);






// $object = [
//     "nama" => "Zunn",
//     "umur" => 20
// ];

// foreach ($object as $key => $value) {
//     echo "key: $key | value $value <br>";
// }

$txt = "hello world";
$txt2 = "hello world2";
$txt3 = "hello world3";
$txt4 = "hello world4";


// echo ucfirst($txt);

echo validateEmptyVar("txt|txtoo|txt3");