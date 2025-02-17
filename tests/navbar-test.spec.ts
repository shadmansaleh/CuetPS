import { test, expect } from "@playwright/test";

test.describe("Navbar", () => {
  test("verify navbar links", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("button", { name: "Home" }).click();
    await expect(page).toHaveURL("http://localhost:3000/");
    await page.getByRole("button", { name: "Gallery" }).click();
    await expect(page).toHaveURL("http://localhost:3000/gallery");
    await page.getByRole("button", { name: "Exhibitions" }).click();
    await expect(page).toHaveURL("http://localhost:3000/exhibitions");
    await page.getByRole("button", { name: "About us" }).click();
    await expect(page).toHaveURL("http://localhost:3000/about");
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page).toHaveURL("http://localhost:3000/login");
  });

  test("verify navbar after login", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("button", { name: "Login" }).click();
    await page.getByPlaceholder("Email address").click();
    await page.getByPlaceholder("Email address").fill("shadman@mail.com");
    await page.getByPlaceholder("Password").click();
    await page.getByPlaceholder("Password").fill("pass");
    await page.getByRole("button", { name: "Sign in" }).click();

    await page.getByRole("button", { name: "Home" }).click();
    await page.getByRole("button", { name: "Home" }).click();
    await expect(page).toHaveURL("http://localhost:3000/");
    await page.getByRole("button", { name: "Gallery" }).click();
    await expect(page).toHaveURL("http://localhost:3000/gallery");
    await page.getByRole("button", { name: "Exhibitions" }).click();
    await expect(page).toHaveURL("http://localhost:3000/exhibitions");
    await page.getByRole("button", { name: "About us" }).click();
    await expect(page).toHaveURL("http://localhost:3000/about");
    await page.getByRole("button", { name: "Profile" }).click();
    await expect(page).toHaveURL("http://localhost:3000/profile/shadman");
    await expect(page.getByRole("button", { name: "Login" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
    await page.getByRole("button", { name: "Logout" }).click();
    await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Logout" })).toHaveCount(0);
  });
});
