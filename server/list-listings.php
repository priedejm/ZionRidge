<?php
// GET, public — returns every listing, sorted by admin-controlled order.
require_once __DIR__ . '/_common.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('Method not allowed', 405);
}

$listings = load_listings();
usort($listings, fn($a, $b) => $a['order'] <=> $b['order']);

json_response($listings);
