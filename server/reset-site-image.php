<?php
// POST {slot}, admin — removes a slot's uploaded photo so the site falls
// back to its original built-in photo.
require_once __DIR__ . '/_common.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed', 405);
}
require_admin_key();

$body = read_body_json();
$slot = (string)($body['slot'] ?? '');
if (!in_array($slot, SITE_IMAGE_SLOTS, true)) json_error('Unknown photo slot');

$images = load_site_images();
if (isset($images[$slot]['url'])) {
    delete_uploaded_url($images[$slot]['url']);
}
unset($images[$slot]);
save_site_images($images);

json_response(['ok' => true]);
