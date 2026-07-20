<?php
// POST JSON incl. id, admin — updates a listing's fields. Never touches
// images; use upload-image.php / delete-image.php / reorder-images.php for that.
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

$validStatuses = ['Active', 'Pending', 'Sold'];
$listing = $listings[$idx];

if (array_key_exists('name', $body)) {
    $name = trim((string)$body['name']);
    if ($name === '') json_error('name cannot be empty');
    $listing['name'] = $name;
}
if (array_key_exists('location', $body)) {
    $location = trim((string)$body['location']);
    if ($location === '') json_error('location cannot be empty');
    $listing['location'] = $location;
}
if (array_key_exists('status', $body)) {
    if (!in_array($body['status'], $validStatuses, true)) {
        json_error('status must be one of: ' . implode(', ', $validStatuses));
    }
    $listing['status'] = $body['status'];
}
if (array_key_exists('description', $body)) {
    $description = trim((string)$body['description']);
    if ($description === '') json_error('description cannot be empty');
    $listing['description'] = $description;
}
if (array_key_exists('overview', $body)) {
    $listing['overview'] = $body['overview'] !== null ? (string)$body['overview'] : null;
}
if (array_key_exists('highlights', $body) && is_array($body['highlights'])) {
    $listing['highlights'] = array_values($body['highlights']);
}
if (array_key_exists('specs', $body) && is_array($body['specs'])) {
    $listing['specs'] = array_values($body['specs']);
}
if (array_key_exists('featured', $body)) {
    $listing['featured'] = (bool)$body['featured'];
}
if (array_key_exists('order', $body)) {
    $listing['order'] = (int)$body['order'];
}

$listings[$idx] = $listing;
save_listings($listings);

json_response($listing);
