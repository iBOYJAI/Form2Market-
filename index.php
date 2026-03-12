<?php
session_start();
if (isset($_SESSION['role'])) {
    if ($_SESSION['role'] === 'admin') header('Location: /farm2market/admin/dashboard.php');
    elseif ($_SESSION['role'] === 'farmer') header('Location: /farm2market/farmer/dashboard.php');
    else header('Location: /farm2market/customer/dashboard.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Farm2Market | Decentralized Agri-Trade Terminal</title>
    <link rel="stylesheet" href="/farm2market/assets/css/style.css">
    <style>
        .hero { min-height: 80vh; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 2rem; }
        .hero-title { font-size: 3.5rem; color: var(--green-bright); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .hero-subtitle { font-size: 1.2rem; color: var(--text-secondary); max-width: 600px; margin-bottom: 2.5rem; line-height: 1.6; }
        .hero-actions { display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap; }
        
        .steps { padding: 4rem 2rem; background: var(--bg-card); border-top: 1px dashed var(--border-dim); border-bottom: 1px dashed var(--border-dim); }
        .step-card { padding: 2rem; border: 1px solid var(--border-dim); text-align: center; height: 100%; }
        .step-num { font-size: 3rem; font-weight: 800; color: var(--bg-primary); -webkit-text-stroke: 1px var(--green-dim); margin-bottom: 1rem; }
        .step-title { color: var(--green-bright); font-size: 1.2rem; margin-bottom: 0.75rem; font-weight: 700; }
        
        .about { padding: 5rem 2rem; max-width: 800px; margin: 0 auto; text-align: center; }
        
        @keyframes blink { 0%,100% {opacity:1;} 50% {opacity:0;} }
        .cursor { display: inline-block; width: 12px; height: 1.2em; background: var(--green-bright); vertical-align: middle; animation: blink 1s step-end infinite; }
    </style>
</head>
<body>

<nav class="navbar">
    <a href="/farm2market/index.php" class="navbar-brand glow">FARM2MARKET_</a>
    <div class="nav-links">
        <a href="#about">SYS_INFO</a>
        <a href="#workflow">WORKFLOW</a>
        <a href="/farm2market/setup/install.php" style="color:var(--amber)">INITIALIZE_DB</a>
        <a href="/farm2market/auth/login.php" class="btn btn-primary btn-sm glow" style="margin-left:1rem;">CONNECT -></a>
    </div>
</nav>

<div class="hero">
    <div class="glow" style="margin-bottom:1rem; font-size:0.85rem; letter-spacing:0.2em; color:var(--amber);">[ SECURE OFFLINE TERMINAL ]</div>
    <h1 class="hero-title glow">Farm To Market<span class="cursor"></span></h1>
    <p class="hero-subtitle">Bypassing intermediaries. Establishing direct P2P connections between local agricultural providers and consumers. Zero transaction fees. Absolute transparency.</p>
    <div class="hero-actions">
        <a href="/farm2market/auth/register.php" class="btn btn-primary" style="font-size:1.1rem; padding: 1rem 2.5rem;">INITIALIZE IDENTITY</a>
        <a href="/farm2market/auth/login.php" class="btn" style="border:1px solid var(--green-bright); color:var(--green-bright); font-size:1.1rem; padding: 1rem 2.5rem;">ACCESS NETWORK</a>
    </div>
</div>

<div class="steps" id="workflow">
    <div class="container">
        <div style="text-align:center; margin-bottom:3rem;">
            <h2 class="glow" style="font-size:2rem; margin:0;">[ OPERATION PROTOCOL ]</h2>
            <p style="color:var(--text-muted)">Standardized 3-tier data flow</p>
        </div>
        <div class="grid-3">
            <div class="step-card">
                <div class="step-num">01</div>
                <div class="step-title glow">PROVISION (FARMER)</div>
                <p style="color:var(--text-secondary); font-size:0.85rem; line-height:1.5;">Providers upload asset data parameters to the local server. Inventory is tracked in real-time within the local network.</p>
            </div>
            <div class="step-card">
                <div class="step-num">02</div>
                <div class="step-title glow-amber" style="color:var(--amber);">VERIFY (ADMIN)</div>
                <p style="color:var(--text-secondary); font-size:0.85rem; line-height:1.5;">Network administrators authenticate listings to ensure data integrity and prevent malicious or inaccurate entities.</p>
            </div>
            <div class="step-card">
                <div class="step-num">03</div>
                <div class="step-title glow" style="color:var(--text-primary);">PROCURE (CUSTOMER)</div>
                <p style="color:var(--text-secondary); font-size:0.85rem; line-height:1.5;">Consumers scan approved local inventories and initiate direct logistics requests to the providers. Cash On Delivery.</p>
            </div>
        </div>
    </div>
</div>

<div class="about" id="about">
    <h2 class="glow" style="font-size:1.8rem; margin-bottom:1.5rem;">> CORE DIRECTIVES</h2>
    <p style="color:var(--text-secondary); line-height:1.8; margin-bottom:1.5rem; text-align:justify;">
        Farm2Market was engineered as a resilient, entirely offline communication matrix designed to function in rural environments with degraded or non-existent external internet routing. By relying solely on local LAN infrastructure (XAMPP/PDO), the system guarantees that agricultural trade can continue uninterrupted. 
    </p>
    <p style="color:var(--text-secondary); line-height:1.8; text-align:justify;">
        The primary objective is the strict elimination of external dependencies (e.g., third-party transporter modules, remote payment gateways) that extract value from the supply chain. This P2P architecture ensures providers retain 100% of the yield value while consumers receive direct-from-source agricultural assets.
    </p>
    <div style="margin-top:3rem; padding:1.5rem; border:1px solid var(--border-dim); display:inline-block; text-align:left;">
        <div style="color:var(--green-bright); margin-bottom:0.5rem; font-weight:700;">[ SYSTEM SPECS ]</div>
        <ul style="color:var(--text-muted); font-size:0.8rem; line-height:1.6; padding-left:1.2rem; margin:0;">
            <li>PHP 8+ Backend Processing</li>
            <li>PDO MySQL Abstracted Data Layer</li>
            <li>CRT Phosphor-Green Visual Subsystem</li>
            <li>No Remote CDN Dependencies</li>
        </ul>
    </div>
</div>

<footer style="text-align:center; padding: 2rem; color:var(--text-muted); font-size: 0.75rem; border-top: 1px solid var(--border-dim); margin-top: auto;">
    &copy; <?= date('Y') ?> Farm2Market | Offline P2P Local Trade Protocol
</footer>

<script src="/farm2market/assets/js/main.js"></script>
</body>
</html>
