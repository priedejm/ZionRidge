<?php
// POST {listingId, imageId}, admin — unlinks the file on disk and removes
// it from the listing's images array.
require_once __DIR__ . '/_common.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed', 405);
}
require_admin_key();

$body = read_body_json();
$listingId = (string)($body['listingId'] ?? '');
$imageId = (string)($body['imageId'] ?? '');
if ($listingId === '' || $imageId === '') json_error('listingId and imageId are required');

$listings = load_listings();
$idx = find_listing_index($listings, $listingId);
if ($idx === -1) json_error('Listing not found', 404);

$images = $listings[$idx]['images'];
$imgIdx = -1;
foreach ($images as $i => $img) {
    if ($img['id'] === $imageId) {
        $imgIdx = $i;
        break;
    }
}
if ($imgIdx === -1) json_error('Image not found', 404);

$url = $images[$imgIdx]['url'];
$path = UPLOAD_ROOT . substr($url, strlen(UPLOAD_URL_BASE));
if (is_file($path)) {
    @unlink($path);
}

array_splice($images, $imgIdx, 1);
$listings[$idx]['images'] = array_values($images);
save_listings($listings);

json_response(['ok' => true, 'images' => $listings[$idx]['images']]);
