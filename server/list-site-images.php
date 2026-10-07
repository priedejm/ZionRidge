<?php
// GET, public — returns the site photo overrides keyed by slot. Slots that
// aren't present use the photo built into the frontend.
require_once __DIR__ . '/_common.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_error('Method not allowed', 405);
}

// (object) so an empty map serializes as {} rather than [].
json_response((object)load_site_images());
