<?php
function loadEnv($path = __DIR__ . '/.env')
{
    if (!file_exists($path)) {
        error_log("n-am gasit .env la : " . $path);
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;

        // error_log('linie: ' . $line);

        list($key, $value) = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value);

        putenv("$key=$value");
        $_ENV[$key] = $value;
        $_SERVER[$key] = $value;

        // error_log("key: " . $key);
        // error_log("value: " . $value);
        // error_log("env: " . getenv($key));
        // error_log("server: " . $_SERVER[$key]);
    }
}
