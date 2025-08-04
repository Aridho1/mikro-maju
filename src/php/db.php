<?php

// session
if (!session_id())
    session_start();

// dotenv
// require_once "../../vendor/autoload.php";

// $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../..');
// $dotenv->load();

// config.json
$json = file_get_contents('../../config.json');
$config = json_decode($json, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    die("JSON LAST ERROR: " . json_last_error_msg());
}

Define("IS_PRODUCTION", $config['is_production'] ?? false);

Define("HOST_NAME", "localhost");
Define("USER_NAME", IS_PRODUCTION ? "mobo7639_mikro_maju_ku" : "root");
Define("PASSWORD", IS_PRODUCTION ? "mobo7639_mikro_maju_ku" : "");
Define("DB_NAME", IS_PRODUCTION ? "mobo7639_mikro_maju" : "mikro_maju");

// force_debug
if (IS_PRODUCTION && ($config['is_force_debug'] ?? false)) {

}

// db
$db = new mysqli(HOST_NAME, USER_NAME, PASSWORD, DB_NAME);

// const
Define('SECRET_KEY', 'MY_SUPER_SECRET_KEY_!@!@#$$123');

// methods
function encodeKey($val)
{
    return base64_encode(base64_encode(SECRET_KEY . $val));
}

function decodeKey($val)
{
    $decoded = base64_decode($val);
    $res = explode(SECRET_KEY, base64_decode($decoded));

    return (count($res) == 1) ? false : $res[1];
}

function encodeKey2($val)
{
    // $encoded = base64_encode(uniqid() . "|" . $val . "|" . uniqid());
    $encoded = base64_encode((time() * rand(1, 40)) . "|" . $val . "|" . (time() * rand(1, 40)));
    $encoded = substr($encoded, 5) . substr($encoded, 0, 5);
    return base64_encode($encoded);
}

function decodeKey2($val)
{
    $decoded = base64_decode($val);
    $decoded = base64_decode(substr($decoded, -5) . substr($decoded, 0, -5));

    $res = explode("|", $decoded);
    return count($res) != 3 ? false : $res[1];
}

function uploadFile(string $name, string $tmpPath): array
{

    $file = $_FILES[$name] ?? false;

    if (!$file)
        return ['status' => false, 'msg' => 'File tidak ada!'];

    $fileName = $file['name'];
    $size = $file['size'];
    $tmpName = $file['tmp_name'];
    $error = $file['error'];

    // Empty
    if ($error === 4)
        return ['status' => false, 'msg' => 'File kosong!'];

    $validExts = ['png', 'webp', 'jpg', 'jpeg', 'gif'];
    $exts = explode('.', $fileName)[1];

    // invalid exts
    if (!in_array($exts, $validExts))
        return ['status' => false, 'msg' => 'Ektensi tidak valid!', 'filename' => $fileName, 'exts' => $exts];

    //5mb
    if (!$size > 5 * 1000 * 1000)
        return ['status' => false, 'msg' => 'Ukuran terlalu besar!'];

    $newName = uniqid() . "." . $exts;
    move_uploaded_file($tmpName, $tmpPath . $newName);

    return ['status' => true, 'data' => $newName];

}

function toGlobal(array $data): void
{

    if (array_keys($data) == range(0, count($data) - 1))
        throw new InvalidArgumentException("Args must be array associative");

    foreach ($data as $key => $val) {
        $GLOBALS[$key] = $val;
    }
}


function datePickerToDate(string|bool $date): bool|string
{

    if (!is_string($date))
        return false;

    $arr = explode('/', $date);

    if (count($arr) != 3)
        return false;

    return $arr[1] . '-' . $arr[0] . '-' . $arr[2];
}

function validateEmptyVar(string $str, bool $is_with_message = false): bool|string
{
    $arr = explode("|", $str);

    $unpass = [];

    foreach ($arr as $key) {
        if (($GLOBALS[$key] ?? null) === null) {
            $unpass[] = $key;
        }
        // try {
        //     $context = $GLOBALS[$key];
        //     echo "$key \ $context<br>";
        // } catch (Throwable $e) {
        //     $unpass[] = "$key (" . $e->getMessage() . ")";
        // }
    }

    // if (!empty($unpass)) {

    //     return "RES: " . implode(",", $unpass);
    // }

    // return true;
    return empty($unpass) ? true : ($is_with_message ? "Missing Required Value: " : "") . implode(", ", $unpass);
}