<?php
// Copy this file to config.php and set a real value before deploying.
// config.php is gitignored — never commit your real admin key.
//
// This is the one and only admin password. The /admin login screen sends
// what the user types to login.php, which checks it here; the browser then
// sends it as the X-Admin-Key header on every mutating request, which the
// endpoints verify with hash_equals(). It is never built into the frontend,
// so changing it only requires editing this file on the server.
define('ADMIN_KEY', 'changeme');
