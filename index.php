<?php
$layout_mode = 'landing';
require_once 'includes/header.php';
?>

<div class="landing-wrap">
    <!-- HERO -->
    <section class="hero">
        <div class="hero-inner">
            <div class="hero-content">
                <div class="hero-tag">
                    <img src="<?= NI ?>ni-award.png" alt="Tag">
                    Direct From Source
                </div>
                <h1 class="hero-h1">
                    Freshness from the <span class="accent">Farm</span>,<br>
                    Direct to your <span class="gold">Market</span>.
                </h1>
                <p class="hero-desc">
                    The ultimate P2P agricultural bridge. We connect local farmers directly with consumers, ensuring fair prices, zero middlemen, and peak quality produce.
                </p>
                <div class="hero-btns">
                    <a href="/farm2market/auth/register.php" class="btn btn-primary btn-lg">Get Started Now</a>
                    <a href="#how-it-works" class="btn btn-outline btn-lg">How it Works</a>
                </div>
                <div class="hero-stats">
                    <div class="h-stat">
                        <div class="hero-stat-val">500+</div>
                        <div class="hero-stat-lbl">Active Farmers</div>
                    </div>
                    <div class="h-stat">
                        <div class="hero-stat-val">12k</div>
                        <div class="hero-stat-lbl">Daily Orders</div>
                    </div>
                    <div class="h-stat">
                        <div class="hero-stat-val">0%</div>
                        <div class="hero-stat-lbl">Middleman Fee</div>
                    </div>
                </div>
            </div>
            <div class="hero-illo">
                <img src="<?= EC ?>ec-easy-shopping.png" alt="Hero Illustration">
            </div>
        </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="how-it-works" id="how-it-works">
        <div class="how-inner">
            <div style="text-align: center; margin-bottom: 3rem;">
                <span class="section-tag">Operation Protocol</span>
                <h2 class="section-title">Standardized 3-tier Data Flow</h2>
                <p class="section-sub" style="margin: 0 auto 3rem;">Our platform simplifies the supply chain into three elegant steps.</p>
            </div>

            <div class="steps-grid">
                <!-- Step 1 -->
                <div class="step-card">
                    <div class="step-num">1</div>
                    <div class="step-illo">
                        <img src="<?= OC ?>oc-taking-note.png" alt="Step 1">
                    </div>
                    <h3 class="step-title">Farmers List Products</h3>
                    <p class="step-desc">Providers upload asset data parameters. Inventory is tracked in real-time within the local network.</p>
                </div>
                <!-- Step 2 -->
                <div class="step-card">
                    <div class="step-num">2</div>
                    <div class="step-illo">
                        <img src="<?= EC ?>ec-analyzing-market-price.png" alt="Step 2">
                    </div>
                    <h3 class="step-title">Buyers Browse & Order</h3>
                    <p class="step-desc">Consumers scan approved local inventories and initiate direct procurement requests.</p>
                </div>
                <!-- Step 3 -->
                <div class="step-card">
                    <div class="step-num">3</div>
                    <div class="step-illo">
                        <img src="<?= EC ?>ec-air-delivery.png" alt="Step 3">
                    </div>
                    <h3 class="step-title">Direct Delivery</h3>
                    <p class="step-desc">Fresh produce is moved directly from the farm to the consumer doorway. Zero delays.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- ROLES -->
    <section class="roles-section">
        <div class="roles-inner">
            <div style="text-align: center; margin-bottom: 2Color; 5rem">
                <span class="section-tag">Choose Your Path</span>
                <h2 class="section-title">Tailored Experiences</h2>
            </div>
            <div class="roles-grid">
                <a href="/farm2market/auth/login.php" class="role-card">
                    <div class="role-illo"><img src="<?= OC ?>oc-target.png"></div>
                    <h3 class="role-name">Administrator</h3>
                    <p class="role-desc">Manage network integrity, verify product listings, and generate marketplace reports.</p>
                    <span class="btn btn-outline btn-block">Access Console</span>
                </a>
                <a href="/farm2market/auth/login.php" class="role-card">
                    <div class="role-illo"><img src="<?= OC ?>oc-on-the-laptop.png"></div>
                    <h3 class="role-name">Farmer</h3>
                    <p class="role-desc">Showcase your produce, manage your inventory, and fulfill direct customer orders.</p>
                    <span class="btn btn-outline btn-block">Grow Your Business</span>
                </a>
                <a href="/farm2market/auth/login.php" class="role-card">
                    <div class="role-illo"><img src="<?= NC ?>nc-woman-typing-on-machine.png"></div>
                    <h3 class="role-name">Customer</h3>
                    <p class="role-desc">Discover the freshest local produce and support your local farming community.</p>
                    <span class="btn btn-outline btn-block">Start Shopping</span>
                </a>
            </div>
        </div>
    </section>

    <!-- VALUES -->
    <section class="values-section">
        <div class="values-inner">
            <h2 class="values-title">Core Directives</h2>
            <p class="values-sub">Resilience, Fairness, and Community First.</p>
            <div class="values-grid">
                <div class="value-card">
                    <div class="value-illo"><img src="<?= OC ?>oc-handshake.png"></div>
                    <h4 class="value-name">Fresh & Direct</h4>
                    <p class="value-desc">Strict elimination of middlemen tokens ensuring 100% yield value retention for providers.</p>
                </div>
                <div class="value-card">
                    <div class="value-illo"><img src="<?= NC ?>nc-gauge-price-sensitivity.png"></div>
                    <h4 class="value-name">Fair Prices</h4>
                    <p class="value-desc">Dynamic market pricing based on local supply and demand, not corporate speculation.</p>
                </div>
                <div class="value-card">
                    <div class="value-illo"><img src="<?= OC ?>oc-hi-five.png"></div>
                    <h4 class="value-name">Community First</h4>
                    <p class="value-desc">Strengthening local economies by keeping agricultural wealth within the district.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- FOOTER -->
    <footer class="site-footer">
        <div class="footer-inner">
            <div class="flex-between">
                <div>
                    <div class="brand">
                        <div class="brand-icon">
                            <img src="<?= NI ?>ni-picking-fruit.png" alt="Icon">
                        </div>
                        <div class="footer-brand-name">FARM2MARKET</div>
                    </div>
                    <p class="footer-motto">Elite Offline P2P Trade Protocol</p>
                </div>
                <div class="hero-btns">
                    <a href="#" class="btn btn-ghost">About</a>
                    <a href="#" class="btn btn-ghost">Terms</a>
                    <a href="/farm2market/setup/install.php" class="btn btn-ghost">System Install</a>
                </div>
            </div>
            <div class="footer-bottom">
                &copy; <?= date('Y') ?> Farm2Market. All Rights Reserved. Engineered for Resilience.
            </div>
        </div>
    </footer>
</div>

<?php require_once 'includes/footer.php'; ?>
