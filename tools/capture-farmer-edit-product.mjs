import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const VIEWPORT = { width: 1366, height: 768 };
const ROOT = "c:\\xampp\\htdocs\\Farm2Market";
const OUT_FILE = path.join(ROOT, "uploads", "report-screenshots", "farmer-edit-product.png");

async function gotoOk(page, url) {
  try {
    const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
    const status = resp?.status();
    if (status && status >= 200 && status < 400) return { ok: true, status, url: page.url() };
    return { ok: false, status: status ?? null, url: page.url() };
  } catch (e) {
    return { ok: false, status: null, error: String(e), url: page.url() };
  }
}

async function detectBaseUrl(page) {
  const candidates = ["http://localhost/Farm2Market/", "http://localhost/farm2market/"];
  for (const base of candidates) {
    const r = await gotoOk(page, `${base}index.php`);
    if (r.ok) return base;
  }
  throw new Error(`Could not load index.php from candidates: ${candidates.join(", ")}`);
}

async function ensureLoggedOut(page, base) {
  await page.goto(`${base}auth/logout.php`, { waitUntil: "domcontentloaded" }).catch(() => {});
  await page.goto(`${base}auth/login.php`, { waitUntil: "domcontentloaded" }).catch(() => {});
}

async function loginFarmer(page, base) {
  await page.goto(`${base}auth/login.php`, { waitUntil: "domcontentloaded" });
  await page.setViewportSize(VIEWPORT);

  const tab = page.locator('.rtab[data-role="farmer"]');
  if (await tab.count()) await tab.first().click();

  await page.locator('input[name="email"]').fill("anbarasu@farm.com");
  await page.locator('input[name="password"]').fill("password123");
  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded" }),
    page.locator('button[type="submit"]').click(),
  ]);
}

async function assertNot404(page, responseStatus) {
  if (responseStatus === 404) throw new Error(`Edit page returned 404 at ${page.url()}`);
  const title = await page.title().catch(() => "");
  if (/404|not found/i.test(title)) throw new Error(`Edit page looks like 404 (title: "${title}")`);
  const bodyText = await page.locator("body").innerText().catch(() => "");
  if (/\b404\b|not found/i.test(bodyText)) throw new Error("Edit page body suggests a 404/Not Found response");
}

async function main() {
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();

  const base = await detectBaseUrl(page);
  await ensureLoggedOut(page, base);
  await loginFarmer(page, base);

  await page.goto(`${base}farmer/my_products.php`, { waitUntil: "domcontentloaded" });
  await page.setViewportSize(VIEWPORT);

  const editLink = page.locator('a[href*="edit_product.php?id="]').first();
  if (!(await editLink.count())) {
    throw new Error("No edit_product.php?id= links found on My Products page.");
  }

  const href = await editLink.getAttribute("href");
  if (!href) throw new Error("First edit link had no href.");

  // Resolve relative URLs against the current page (some links are relative to /farmer/).
  const editUrl = href.startsWith("http") ? href : new URL(href, page.url()).toString();
  const r = await gotoOk(page, editUrl);
  if (!r.ok) throw new Error(`Failed to load edit page (status: ${r.status ?? "unknown"}) at ${editUrl}`);
  await assertNot404(page, r.status);

  await page.waitForLoadState("networkidle").catch(() => {});
  await page.screenshot({ path: OUT_FILE, fullPage: false });

  await browser.close();

  process.stdout.write(`${page.url()}\n${OUT_FILE}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

