
SELECT 
  t.id, 
  JSON_ARRAYAGG(
    JSON_OBJECT(
      'transaction_id', td.transaction_id, 
      'item_id', td.item_id
    )
  ) AS transaction_details
FROM 
  transactions t
JOIN 
  transaction_detail td ON t.id = td.transaction_id
GROUP BY 
  t.id;
  
  
  SELECT 
  t.id, 
  GROUP_CONCAT(
    CONCAT(
      '{"transaction_id": "', td.transaction_id, 
      '", "item_id": "', td.item_id, 
      '"}'
    )
  ) AS transaction_details
FROM 
  transactions t
JOIN 
  transaction_detail td ON t.id = td.transaction_id
GROUP BY 
  t.id;
