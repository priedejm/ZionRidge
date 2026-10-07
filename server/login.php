<?php
// POST with X-Admin-Key header, admin — verifies the password typed on the
// /admin login screen against ADMIN_KEY in config.php. The password is never
// shipped in the frontend bundle; the browser keeps what the user typed for
// the session and sends it on every mutating request.
require_once __DIR__ . '/_common.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error('Method not allowed', 405);
}

$provided = $_SERVER['HTTP_X_ADMIN_KEY'] ?? '';
if (!hash_equals(ADMIN_KEY, $provided)) {
    // Slow down password guessing.
    sleep(1);
    json_error('Incorrect password', 401);
}

json_response(['ok' => true]);
