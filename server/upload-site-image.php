<?php
// POST multipart/form-data {slot, file}, admin — replaces the photo shown in
// one site slot (see SITE_IMAGE_SLOTS). Writes to assets/uploaded/site/
// under a server-generated filename and deletes the slot's previous upload.
require_once __DIR__ . '/_common.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed', 405);
}
require_admin_key();

$ext = validate_uploaded_image();
$file = $_FILES['file'];

$slot = (string)($_POST['slot'] ?? '');
if (!in_array($slot, SITE_IMAGE_SLOTS, true)) json_error('Unknown photo slot');

$siteDir = UPLOAD_ROOT . '/site';
if (!is_dir($siteDir)) {
    mkdir($siteDir, 0755, true);
}

// uniqid, not time(): two uploads in the same second would otherwise share a
// name and the cleanup below would delete the file just written.
$filename = $slot . '-' . uniqid() . '.' . $ext;
if (!move_uploaded_file($file['tmp_name'], $siteDir . '/' . $filename)) {
    json_error('Could not save uploaded file', 500);
}

$images = load_site_images();
if (isset($images[$slot]['url'])) {
    delete_uploaded_url($images[$slot]['url']);
}

$images[$slot] = [
    'url' => UPLOAD_URL_BASE . '/site/' . $filename,
    'filename' => basename($file['name']),
];
save_site_images($images);

json_response($images[$slot], 201);
