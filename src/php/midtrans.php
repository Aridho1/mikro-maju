<?php

/*Install Midtrans PHP Library (https://github.com/Midtrans/midtrans-php)
composer require midtrans/midtrans-php
                              
Alternatively, if you are not using **Composer**, you can download midtrans-php library 
(https://github.com/Midtrans/midtrans-php/archive/master.zip), and then require 
the file manually.   

require_once dirname(__FILE__) . '/pathofproject/Midtrans.php'; */

// require_once dirname(__FILE__) . './../../pkg/midtrans-php/Midtrans.php';

// //SAMPLE REQUEST START HERE

// // Set your Merchant Server Key
// \Midtrans\Config::$serverKey = 'SB-Mid-server-LmcKxJVkNmmASwHGc2JDV6qw';
// // Set to Development/Sandbox Environment (default). Set to true for Production Environment (accept real transaction).
// \Midtrans\Config::$isProduction = false;
// // Set sanitization on (default)
// \Midtrans\Config::$isSanitized = true;
// // Set 3DS transaction for credit card to true
// \Midtrans\Config::$is3ds = true;

// $params = array(
//     'transaction_details' => array(
//         'order_id' => rand(),
//         'gross_amount' => 10000,
//         'name' => 'Budi'
//     ),
//     // 'customer_details' => array(
//     //     'first_name' => 'budi',
//     //     'last_name' => 'pratama',
//     //     'email' => 'budi.pra@example.com',
//     //     'phone' => '08111222333',
//     // ),
// );

// $snapToken = \Midtrans\Snap::getSnapToken($params);
// echo $snapToken;

require_once dirname(__FILE__) . '/../../pkg/midtrans-php/Midtrans.php';

// Konfigurasi hanya dilakukan sekali di dalam helper
\Midtrans\Config::$serverKey = 'SB-Mid-server-LmcKxJVkNmmASwHGc2JDV6qw';
\Midtrans\Config::$isProduction = false;
\Midtrans\Config::$isSanitized = true;
\Midtrans\Config::$is3ds = true;

/**
 * Generate Snap Token dari Midtrans
 *
 * @param int $grossAmount
 * @param string $name
 * @return string|null
 */

function createTransaction(int $grossAmount, string $order_id, array $item_details): array
{
    try {
        $params = [
            'transaction_details' => [
                'order_id' => $order_id,
                'gross_amount' => $grossAmount,
            ],
            // 'customer_details' => [
            //     'first_name' => $name, // ganti jadi first_name
            //     // 'email' => 'guest@example.com',
            //     // 'phone' => '08123456789',
            // ],
            'item_details' => $item_details,

            // Optional custom fields kalau mau
            // 'custom_field1' => $name,
        ];

        return ['status' => true, 'res' => \Midtrans\Snap::createTransaction($params)];
    } catch (Exception $e) {
        error_log("Midtrans Error: " . $e->getMessage());
        return ['status' => false, 'msg' => $e->getMessage()];
    }
}





/**
 * Ambil status transaksi dari Midtrans berdasarkan order_id
 *
 * @param string $order_id
 * @return array
 */
function getTransactionStatus(string $order_id): array
{
    try {
        $status = \Midtrans\Transaction::status($order_id);
        return [
            'status' => true,
            'data' => (array) $status // kamu bisa mengakses misal $status->transaction_status, $status->payment_type, dll
        ];
    } catch (Exception $e) {
        return [
            'status' => false,
            'msg' => $e->getMessage()
        ];
    }
}