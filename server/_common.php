<?php
// Shared bootstrap for every endpoint in this folder: CORS, JSON helpers,
// flat-file read/write with locking, and the shared-secret admin check.
// No database, no framework — see server/README.md for the full picture.

require_once __DIR__ . '/config.php';

define('DATA_FILE', __DIR__ . '/data/projects.json');
define('UPLOAD_ROOT', __DIR__ . '/assets/uploaded');
define('UPLOAD_URL_BASE', '/assets/uploaded');

function send_cors_headers(): void
{
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Admin-Key');
    header('Content-Type: application/json');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function json_response($data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_PRETTY_PRINT);
    exit;
}

function json_error(string $message, int $status = 400): void
{
    json_response(['error' => $message], $status);
}

function read_body_json(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        json_error('Invalid or missing JSON body', 400);
    }
    return $data;
}

// The React admin UI sends this on every mutating request. It's the same
// insecure-but-better-than-nothing check described in config.example.php.
function require_admin_key(): void
{
    $provided = $_SERVER['HTTP_X_ADMIN_KEY'] ?? '';
    if (!hash_equals(ADMIN_KEY, $provided)) {
        json_error('Unauthorized', 401);
    }
}

// Reads data/projects.json under a shared lock. Returns [] if the file is
// missing/empty rather than erroring — a fresh deploy starts with no listings.
function load_listings(): array
{
    if (!file_exists(DATA_FILE)) {
        return [];
    }
    $fh = fopen(DATA_FILE, 'r');
    if ($fh === false) {
        json_error('Could not read listings data', 500);
    }
    flock($fh, LOCK_SH);
    $raw = stream_get_contents($fh);
    flock($fh, LOCK_UN);
    fclose($fh);

    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

// Writes the full listings array back under an exclusive lock. This is the
// only concurrency protection in place — acceptable for single-admin use,
// not a substitute for a real database.
function save_listings(array $listings): void
{
    $fh = fopen(DATA_FILE, 'c+');
    if ($fh === false) {
        json_error('Could not write listings data', 500);
    }
    flock($fh, LOCK_EX);
    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($listings, JSON_PRETTY_PRINT));
    fflush($fh);
    flock($fh, LOCK_UN);
    fclose($fh);
}

function find_listing_index(array $listings, string $id): int
{
    foreach ($listings as $i => $listing) {
        if ($listing['id'] === $id) {
            return $i;
        }
    }
    return -1;
}

// Slugifies $name and appends a numeric suffix if the slug collides with
// an existing id, so ids stay stable, readable, and unique.
function generate_unique_id(string $name, array $listings): string
{
    $base = strtolower(trim($name));
    $base = preg_replace('/[^a-z0-9]+/', '-', $base);
    $base = trim($base, '-');
    if ($base === '') {
        $base = 'listing';
    }

    $existingIds = array_column($listings, 'id');
    $id = $base;
    $suffix = 2;
    while (in_array($id, $existingIds, true)) {
        $id = $base . '-' . $suffix;
        $suffix++;
    }
    return $id;
}

function next_order(array $listings): int
{
    if (empty($listings)) {
        return 0;
    }
    return max(array_column($listings, 'order')) + 1;
}

// Recursively deletes a directory and its contents (a listing's image folder).
function delete_dir_recursive(string $dir): void
{
    if (!is_dir($dir)) {
        return;
    }
    $items = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::CHILD_FIRST
    );
    foreach ($items as $item) {
        $item->isDir() ? rmdir($item->getPathname()) : unlink($item->getPathname());
    }
    rmdir($dir);
}

send_cors_headers();
