<?php
require_once __DIR__ . '/../db.php';
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
$required_role = $required_role ?? null;

if (!isset($_SESSION['role']) || !isset($_SESSION['user_id'])) {
    header('Location: ' . BASE_URL . 'auth/login.php');
    exit();
}

if ($required_role && $_SESSION['role'] !== $required_role) {
    header('Location: ' . BASE_URL . 'auth/login.php?error=unauthorized');
    exit();
}
