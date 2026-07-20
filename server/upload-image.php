<?php
// POST multipart/form-data {listingId, file}, admin — one call per file
// (the admin UI loops client-side for multi-select). Validates the upload
// is a real image, checks MIME + extension + size, then writes it to
// assets/uploaded/listing-{id}/ under a server-generated filename (never
// the client-supplied name, to avoid path traversal) and appends it to
// that listing's images array.
require_once __DIR__ . '/_common.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed', 405);
}
require_admin_key();

$listingId = (string)($_POST['listingId'] ?? '');
if ($listingId === '') json_error('listingId is required');

$listings = load_listings();
$idx = find_listing_index($listings, $listingId);
if ($idx === -1) json_error('Listing not found', 404);

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    json_error('No valid file uploaded');
}

$file = $_FILES['file'];
$maxBytes = 5 * 1024 * 1024;
if ($file['size'] > $maxBytes) {
    json_error('File exceeds 5MB limit');
}

$imageInfo = @getimagesize($file['tmp_name']);
if ($imageInfo === false) {
    json_error('File is not a valid image');
}

$allowedMimes = [
    'image/jpeg' => 'jpg',
    'image/png' => 'png',
    'image/webp' => 'webp',
];
$mime = $imageInfo['mime'];
if (!isset($allowedMimes[$mime])) {
    json_error('Unsupported image type — use JPEG, PNG, or WebP');
}
$ext = $allowedMimes[$mime];

$listingDir = UPLOAD_ROOT . '/listing-' . $listingId;
if (!is_dir($listingDir)) {
    mkdir($listingDir, 0755, true);
}

$imageId = uniqid('img_', true);
$filename = time() . '-' . count($listings[$idx]['images']) . '.' . $ext;
$destPath = $listingDir . '/' . $filename;

if (!move_uploaded_file($file['tmp_name'], $destPath)) {
    json_error('Could not save uploaded file', 500);
}

$image = [
    'id' => $imageId,
    'url' => UPLOAD_URL_BASE . '/listing-' . $listingId . '/' . $filename,
    'filename' => basename($file['name']),
];

$listings[$idx]['images'][] = $image;
save_listings($listings);

json_response($image, 201);
