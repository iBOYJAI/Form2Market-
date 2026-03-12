<?php
session_start();
$required_role = $required_role ?? null;

if (!isset($_SESSION['role']) || !isset($_SESSION['user_id'])) {
    header('Location: /farm2market/auth/login.php');
    exit();
}

if ($required_role && $_SESSION['role'] !== $required_role) {
    header('Location: /farm2market/auth/login.php?error=unauthorized');
    exit();
}
