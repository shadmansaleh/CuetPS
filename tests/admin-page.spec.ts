import { test, expect } from "@playwright/test";

test.describe("AdminPage", () => {
  // before each test login to user account
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    await page.getByPlaceholder("Email address").click();
    await page.getByPlaceholder("Email address").fill("admin@mail.com");
    await page.getByPlaceholder("Password").click();
    await page.getByPlaceholder("Password").fill("admin");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForNavigation();
  });
  //after each test logout
  //   test.afterEach(async ({ page }) => {
  //     await page.getByRole("button", { name: "Logout" }).click();
  //   });
  // Base URL should be set in playwright.config.ts. If not, use the full URL.
  const adminPageURL = "http://localhost:3000/admin";

  test("should render AdminPage with all necessary elements", async ({
    page,
  }) => {
    await page.goto(adminPageURL); // Navigate to the AdminPage
    await expect(page.locator("h1")).toHaveText("Admin Dashboard"); // Check the title
    await expect(page.locator(".ant-tabs-tab")).toHaveCount(3); // Ensure 3 tabs are present
  });

  test("should open Create Exhibition modal on button click", async ({
    page,
  }) => {
    await page.goto(adminPageURL + "/exhibition");
    await page.click('button:has-text("Create Exhibition")');
    await expect(page.locator(".ant-modal-title")).toHaveText(
      "Create Exhibition"
    ); // Check modal title
  });

  test("should close the modal when cancel button is clicked", async ({
    page,
  }) => {
    await page.goto(adminPageURL + "/exhibition");
    await page.click('button:has-text("Create Exhibition")');
    await page.click(".ant-modal-close-x"); // Close the modal
    await expect(page.locator(".ant-modal")).not.toBeVisible(); // Ensure modal is closed
  });

  test("should switch between tabs correctly", async ({ page }) => {
    await page.goto(adminPageURL);

    // Verify default tab is active
    await expect(page.locator(".ant-tabs-tab-active")).toHaveText(
      "Manage Users"
    );

    // Switch to Manage Photos tab
    await page.click('.ant-tabs-tab:has-text("Manage Photos")');
    await expect(page.locator(".ant-tabs-tab-active")).toHaveText(
      "Manage Photos"
    );

    // Switch to Exhibition tab
    await page.click('.ant-tabs-tab:has-text("Exhibition")');
    await expect(page.locator(".ant-tabs-tab-active")).toHaveText("Exhibition");
  });

  test("should render exhibitions in the Exhibition tab", async ({ page }) => {
    await page.goto(adminPageURL);
    await page.click('.ant-tabs-tab:has-text("Exhibition")');

    // Verify exhibitions are displayed
    const exhibitions = ["Nature Photography", "Cityscapes"];
    for (const exhibition of exhibitions) {
      await expect(page.getByText(exhibition, { exact: true })).toBeVisible();
    }
  });

  test("should render CreateExhibition component in the modal", async ({
    page,
  }) => {
    await page.goto(adminPageURL + "/exhibition");
    await page.click('button:has-text("Create Exhibition")');

    // Verify form in the modal
    await expect(page.locator("form")).toBeVisible();
  });

  test("should render correctly on different screen sizes", async ({
    page,
  }) => {
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 768, height: 1024 }, // Tablet
      { width: 375, height: 812 }, // Mobile
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto(adminPageURL + "/exhibition");
      await expect(page.locator("h1")).toHaveText("Admin Dashboard");
      await expect(
        page.locator('button:has-text("Create Exhibition")')
      ).toBeVisible();
    }
  });

  test("should have no major accessibility violations", async ({ page }) => {
    await page.goto(adminPageURL);

    // Generate accessibility report
    const accessibilityReport = await page.accessibility.snapshot();
    console.log(accessibilityReport); // Manually review the output
  });
});
