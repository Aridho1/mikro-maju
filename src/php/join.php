<?php 

/*

DELIMITER $$

CREATE FUNCTION IDR(price DECIMAL(20, 0)) RETURNS VARCHAR(30)
BEGIN
    DECLARE formated_price VARCHAR(30);
    SET formated_price = CONCAT('RP ', REPLACE(FORMAT(price, 0), ',', '.'));
    RETURN formated_price;
END$$

DELIMITER ;

*/

include_once "db.php";

$res = $db->query(
"
SELECT 
  t.id,
  t.name,
  IDR(t.total) AS total,  
  GROUP_CONCAT(
    CONCAT(
        '{',
	            '\"name\": \"', i.name, 
            '\", \"price\": \"', IDR(i.price),
	        '\", \"quantity\": \"', td.quantity,
	        '\", \"sub_total\": \"', IDR(td.sub_total), '\"',
        '}'
    )
  ) AS transaction_details
FROM 
  transactions t
JOIN 
  transaction_details td ON t.id = td.transaction_id
  JOIN items i ON td.item_id = i.id 
  GROUP BY t.id;
"


// "
// SELECT 
  // t.id, 
  // GROUP_CONCAT(
    // CONCAT(
      // '{\"transaction_id\": \"', td.transaction_id, 
      // '\", \"item_id\": \"', td.item_id, 
      // '\"}'
    // )
  // ) AS transaction_details
// FROM 
  // transactions t
// JOIN 
  // transaction_details td ON t.id = td.transaction_id
// GROUP BY 
  // t.id;
// "


// "SELECT t.id, GROUP_CONCAT( CONCAT( '{\"transaction_id\": \"', td.transaction_id, '\", \"item_id": \"', td.item_id, '\"}' ) ) AS transaction_details FROM transactions t JOIN transaction_details td on t.id = td.transaction_id GROUP BY t.id"
// "SELECT JSON_ARRAYAGG(name) AS names FROM items"
// "
    // SELECT
    // t.id,
	// JSON_ARRAYAGG(
	    // JSON_OBJECT(
		    // 'transaction_id', td.transaction_id,
			// 'item', JSON_OBJECT(
			    // 'id', i.id,
				// 'name', i.name
			// )
		// )
	// ) AS transaction_details
	// FROM transactions t
	// JOIN
	// transaction_details td ON t.id = td.transaction_id
	// JOIN items i ON td.item_id = i.id
	// GROUP BY
	// t.id
// "
);

$data = [];

while ($row = mysqli_fetch_assoc($res))  {
	$row['transaction_details'] = json_decode('[' . $row['transaction_details'] . ']', true);
	$data[] = $row;
}

echo json_encode(['data' => $data]);