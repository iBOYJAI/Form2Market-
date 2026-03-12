import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const VIEWPORT = { width: 1366, height: 768 };
const ROOT = "c:\\xampp\\htdocs\\Farm2Market";
const OUT_DIR = path.join(ROOT, "uploads", "report-screenshots");

function outPath(name) {
  return path.join(OUT_DIR, `${name}.png`);
}

async function safeScreenshot(page, name) {
  const file = outPath(name);
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.screenshot({ path: file, fullPage: false });
  return file;
}

async function gotoOk(page, url) {
  try {
    const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
    const status = resp?.status();
    if (status && status >= 200 && status < 400) return { ok: true, status };
    return { ok: false, status: status ?? null };
  } catch (e) {
    return { ok: false, status: null, error: String(e) };
  }
}

async function detectBaseUrl(page) {
  const candidates = [
    "http://localhost/Farm2Market/",
    "http://localhost/farm2market/",
  ];
  for (const base of candidates) {
    const r = await gotoOk(page, `${base}index.php`);
    if (r.ok) return base;
  }
  throw new Error(`Could not load index.php from candidates: ${candidates.join(", ")}`);
}

async function login(page, base, { role, email, password }) {
  await page.goto(`${base}auth/login.php`, { waitUntil: "domcontentloaded" });
  await page.setViewportSize(VIEWPORT);

  const tab = page.locator(`.rtab[data-role="${role}"]`);
  if (await tab.count()) await tab.first().click();

  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill(password);
  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded" }),
    page.locator('button[type="submit"]').click(),
  ]);
}

async function ensureLoggedOut(page, base) {
  // Prefer direct logout, but its redirect target is hard-coded and may be wrong-case.
  await page.goto(`${base}auth/logout.php`, { waitUntil: "domcontentloaded" }).catch(() => {});
  await page.goto(`${base}auth/login.php`, { waitUntil: "domcontentloaded" }).catch(() => {});
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();

  const saved = [];
  const base = await detectBaseUrl(page);

  // Public pages
  await page.goto(`${base}index.php`, { waitUntil: "domcontentloaded" });
  await page.setViewportSize(VIEWPORT);
  saved.push(await safeScreenshot(page, "landing-index"));

  await page.goto(`${base}auth/login.php`, { waitUntil: "domcontentloaded" });
  await page.setViewportSize(VIEWPORT);
  saved.push(await safeScreenshot(page, "auth-login"));

  await page.goto(`${base}auth/register.php`, { waitUntil: "domcontentloaded" });
  await page.setViewportSize(VIEWPORT);
  saved.push(await safeScreenshot(page, "auth-register"));

  // Setup page (optional)
  {
    const r = await gotoOk(page, `${base}setup/install.php`);
    if (r.ok) {
      await page.setViewportSize(VIEWPORT);
      saved.push(await safeScreenshot(page, "setup-install"));
    }
  }

  // Admin flow
  await ensureLoggedOut(page, base);
  await login(page, base, { role: "admin", email: "admin@farm2market.com", password: "admin123" });
  await page.goto(`${base}admin/dashboard.php`, { waitUntil: "domcontentloaded" });
  saved.push(await safeScreenshot(page, "admin-dashboard"));
  await page.goto(`${base}admin/manage_users.php`, { waitUntil: "domcontentloaded" });
  saved.push(await safeScreenshot(page, "admin-manage-users"));
  await page.goto(`${base}admin/manage_products.php`, { waitUntil: "domcontentloaded" });
  saved.push(await safeScreenshot(page, "admin-manage-products"));
  await page.goto(`${base}admin/manage_orders.php`, { waitUntil: "domcontentloaded" });
  saved.push(await safeScreenshot(page, "admin-manage-orders"));
  await page.goto(`${base}admin/reports.php`, { waitUntil: "domcontentloaded" });
  saved.push(await safeScreenshot(page, "admin-reports"));

  // Farmer flow
  await ensureLoggedOut(page, base);
  await login(page, base, { role: "farmer", email: "anbarasu@farm.com", password: "password123" });
  await page.goto(`${base}farmer/dashboard.php`, { waitUntil: "domcontentloaded" });
  saved.push(await safeScreenshot(page, "farmer-dashboard"));
  await page.goto(`${base}farmer/add_product.php`, { waitUntil: "domcontentloaded" });
  saved.push(await safeScreenshot(page, "farmer-add-product"));
  await page.goto(`${base}farmer/my_products.php`, { waitUntil: "domcontentloaded" });
  saved.push(await safeScreenshot(page, "farmer-my-products"));
  // Optional edit product (first)
  {
    const editLink = page.locator('a[href*="edit_product.php?id="]').first();
    if (await editLink.count()) {
      const href = await editLink.getAttribute("href");
      if (href) {
        const abs = href.startsWith("http") ? href : new URL(href, base).toString();
        await page.goto(abs, { waitUntil: "domcontentloaded" });
        saved.push(await safeScreenshot(page, "farmer-edit-product"));
      }
    }
  }
  await page.goto(`${base}farmer/my_orders.php`, { waitUntil: "domcontentloaded" });
  saved.push(await safeScreenshot(page, "farmer-my-orders"));

  // Customer flow
  await ensureLoggedOut(page, base);
  await login(page, base, { role: "customer", email: "karthik@buyer.com", password: "password123" });
  await page.goto(`${base}customer/dashboard.php`, { waitUntil: "domcontentloaded" });
  saved.push(await safeScreenshot(page, "customer-dashboard"));
  await page.goto(`${base}customer/browse.php`, { waitUntil: "domcontentloaded" });
  saved.push(await safeScreenshot(page, "customer-browse"));

  // Open first product detail (optional if any product exists)
  {
    const detailLink = page.locator('a[href*="product_detail.php?id="]').first();
    if (await detailLink.count()) {
      const href = await detailLink.getAttribute("href");
      if (href) {
        const abs = href.startsWith("http") ? href : new URL(href, base).toString();
        await page.goto(abs, { waitUntil: "domcontentloaded" });
        saved.push(await safeScreenshot(page, "customer-product-detail"));

        // Place order screen (qty=1) if possible
        const qty = page.locator('input[name="qty"]');
        if (await qty.count()) {
          await qty.fill("1");
        }
        const initBtn = page.getByRole("button", { name: /Initialize Procurement/i });
        if (await initBtn.count()) {
          await Promise.all([
            page.waitForNavigation({ waitUntil: "domcontentloaded" }),
            initBtn.click(),
          ]);
          saved.push(await safeScreenshot(page, "customer-place-order"));
        }
      }
    }
  }

  await page.goto(`${base}customer/my_orders.php`, { waitUntil: "domcontentloaded" });
  saved.push(await safeScreenshot(page, "customer-my-orders"));

  await browser.close();

  // Print newline-delimited absolute paths for easy collection
  process.stdout.write(saved.join("\n"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

