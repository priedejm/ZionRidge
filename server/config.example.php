<?php
// Copy this file to config.php and set a real value before deploying.
// config.php is gitignored — never commit your real admin key.
//
// This single constant serves two purposes, both intentionally simple
// (documented in server/README.md and the main implementation plan):
//   1. It's the password checked by the React /admin login screen.
//   2. It's sent back as the X-Admin-Key header on every mutating request,
//      which the PHP endpoints below verify with hash_equals().
// Neither check is a real security boundary: the value ships inside the
// built JS bundle in plaintext and can be read via devtools/view-source.
// It only stops casual/automated abuse, not a determined attacker.
define('ADMIN_KEY', 'changeme');
