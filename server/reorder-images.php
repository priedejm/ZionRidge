<?php
// POST {listingId, imageIds: string[]}, admin — persists a new image order;
// imageIds[0] becomes the cover photo. Rejects a set that doesn't exactly
// match the listing's current images so the array never silently drops one.
require_once __DIR__ . '/_common.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed', 405);
}
require_admin_key();

$body = read_body_json();
$listingId = (string)($body['listingId'] ?? '');
$imageIds = $body['imageIds'] ?? null;
if ($listingId === '' || !is_array($imageIds)) {
    json_error('listingId and imageIds are required');
}

$listings = load_listings();
$idx = find_listing_index($listings, $listingId);
if ($idx === -1) json_error('Listing not found', 404);

$images = $listings[$idx]['images'];
$byId = [];
foreach ($images as $img) {
    $byId[$img['id']] = $img;
}

if (count($imageIds) !== count($images) || array_diff($imageIds, array_keys($byId)) !== []) {
    json_error('imageIds must match the listing\'s current image set exactly');
}

$reordered = array_map(fn($id) => $byId[$id], $imageIds);
$listings[$idx]['images'] = $reordered;
save_listings($listings);

json_response(['ok' => true, 'images' => $reordered]);
