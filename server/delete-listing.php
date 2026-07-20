<?php
// POST {id}, admin — removes the JSON entry and recursively deletes its
// uploaded image folder.
require_once __DIR__ . '/_common.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed', 405);
}
require_admin_key();

$body = read_body_json();
$id = (string)($body['id'] ?? '');
if ($id === '') json_error('id is required');

$listings = load_listings();
$idx = find_listing_index($listings, $id);
if ($idx === -1) json_error('Listing not found', 404);

array_splice($listings, $idx, 1);
save_listings($listings);

delete_dir_recursive(UPLOAD_ROOT . '/listing-' . $id);

json_response(['ok' => true]);
