import { test, expect } from "@playwright/test";

test.describe("Exhibition page", () => {
  test("create exhibition", async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    await page.getByPlaceholder("Email address").click();
    await page.getByPlaceholder("Email address").fill("admin");
    await page.getByPlaceholder("Password").click();
    await page.getByPlaceholder("Password").fill("admin");
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.getByRole("tab", { name: "Exhibition" }).click();

    await page.getByRole("button", { name: "Create Exhibition" }).click();
    await page.getByRole("textbox", { name: "* Exhibition Title" }).click();
    await page
      .getByRole("textbox", { name: "* Exhibition Title" })
      .fill("Test Exhibition");
    await page
      .getByRole("textbox", { name: "* Exhibition Description" })
      .click();
    await page
      .getByRole("textbox", { name: "* Exhibition Description" })
      .fill("test exhibition description");
    await page.getByRole("textbox", { name: "* Start Date" }).click();
    await page
      .getByRole("textbox", { name: "* Start Date" })
      .fill("2025-02-19");
    await page.getByRole("textbox", { name: "* End Date" }).click();
    await page.getByRole("textbox", { name: "* End Date" }).fill("2025-02-27");
    await page
      .locator('.ant-upload input[type="file"]')
      .setInputFiles("tests/assets/photo1.jpg");

    await page.locator('button[type="submit"]').click();

    await expect(page.getByLabel("Exhibition").locator("tbody")).toContainText(
      "Test Exhibition"
    );
  });
});

test("test photo upload", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByPlaceholder("Email address").click();
  await page.getByPlaceholder("Email address").fill("shadman");
  await page.getByPlaceholder("Password").click();
  await page.getByPlaceholder("Password").fill("pass");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("button", { name: "Exhibitions" }).click();
  await page.getByRole("link", { name: "My Exhibition My Exhibition" }).click();
  await page.getByRole("button", { name: "Exhibitions" }).click();
  await page.getByRole("link", { name: "Test Exhibition Test" }).click();
  await page.getByRole("button", { name: "Upload" }).click();
  await page.getByPlaceholder("Title").click();
  await page.getByPlaceholder("Title").fill("asdf");
  await page.getByPlaceholder("Caption").click();
  await page.getByPlaceholder("Caption").fill("asdf");
  await page.locator('input[name="file"]').click();
  await page
    .locator('input[name="file"]')
    .setInputFiles("tests/assets/photo2.jpg");
  await page.locator('input[type="submit"]').click();
  await expect(page.locator(".absolute").first()).toBeVisible();
});
