<?php
$host = 'localhost';
$dbname = 'farm2market_db';
$user = 'root';
$pass = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    die('<div style="font-family:monospace;color:#ff3333;background:#0a0f0a;padding:2rem;">DB Error: '.$e->getMessage().'</div>');
}
