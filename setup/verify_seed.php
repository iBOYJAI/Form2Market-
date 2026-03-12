<?php
require_once __DIR__ . '/../db.php';

header('Content-Type: text/plain; charset=utf-8');

function countTable(PDO $pdo, string $sql): int {
    return (int)$pdo->query($sql)->fetchColumn();
}

echo "farmers=" . countTable($pdo, "SELECT COUNT(1) FROM farmers") . PHP_EOL;
echo "customers=" . countTable($pdo, "SELECT COUNT(1) FROM customers") . PHP_EOL;
echo "products=" . countTable($pdo, "SELECT COUNT(1) FROM products") . PHP_EOL;
echo "approved_products=" . countTable($pdo, "SELECT COUNT(1) FROM products WHERE Status='approved'") . PHP_EOL;
echo "orders=" . countTable($pdo, "SELECT COUNT(1) FROM orders") . PHP_EOL;
