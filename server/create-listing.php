<?php
// POST JSON, admin — appends a new listing and creates its upload folder.
require_once __DIR__ . '/_common.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed', 405);
}
require_admin_key();

$body = read_body_json();

$validStatuses = ['Active', 'Pending', 'Sold'];
$name = trim((string)($body['name'] ?? ''));
$location = trim((string)($body['location'] ?? ''));
$status = (string)($body['status'] ?? '');
$description = trim((string)($body['description'] ?? ''));

if ($name === '') json_error('name is required');
if ($location === '') json_error('location is required');
if (!in_array($status, $validStatuses, true)) json_error('status must be one of: ' . implode(', ', $validStatuses));
if ($description === '') json_error('description is required');

$listings = load_listings();
$id = generate_unique_id($name, $listings);

$listing = [
    'id' => $id,
    'name' => $name,
    'location' => $location,
    'status' => $status,
    'description' => $description,
    'overview' => isset($body['overview']) ? (string)$body['overview'] : null,
    'highlights' => isset($body['highlights']) && is_array($body['highlights']) ? array_values($body['highlights']) : [],
    'specs' => isset($body['specs']) && is_array($body['specs']) ? array_values($body['specs']) : [],
    'featured' => !empty($body['featured']),
    'images' => [],
    'order' => next_order($listings),
    'createdAt' => date('c'),
];

$listings[] = $listing;
save_listings($listings);

@mkdir(UPLOAD_ROOT . '/listing-' . $id, 0755, true);

json_response($listing, 201);
