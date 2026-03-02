import { test, expect } from "@playwright/test";

test("Admin Auth Flow", async ({ page }) => {
  // 1. Go to Login
  console.log("Navigating to login...");
  await page.goto("/admin/login");

  // 2. Fill Credentials
  console.log("Filling credentials...");
  await page.fill('input[type="email"]', "admin@mekarsawit");
  await page.fill('input[type="password"]', "admin123");

  // 3. Submit
  console.log("Submitting form...");
  await page.click('button[type="submit"]');

  // 4. Verify Dashboard Access
  console.log("Waiting for dashboard redirect...");
  // Increase timeout for potentially slow production builds running locally
  await page.waitForURL("**/admin/dashboard", { timeout: 10000 });
  console.log("Dashboard reached!");

  // Take screenshot of dashboard
  await page.screenshot({ path: "tests/dashboard-evidence.png" });

  // 5. Navigate to "Codes" page
  console.log("Navigating to admin/codes via Navbar...");
  await page.getByRole("link", { name: "Kode Desa" }).click();

  // 6. Verify URL and Content
  console.log("Verifying codes page URL...");
  await page.waitForURL("**/admin/codes");
  expect(page.url()).toContain("/admin/codes");

  console.log("Checking page content...");

  try {
    await expect(
      page.getByRole("heading", { name: "Kelola Kode Akses Desa" }),
    ).toBeVisible({ timeout: 15000 });
  } catch (e) {
    console.log("Heading not visible. Current page content:");
    console.log(await page.content());
    throw e;
  }

  await page.screenshot({ path: "tests/codes-evidence.png" });
  console.log("Test Complete!");
});
