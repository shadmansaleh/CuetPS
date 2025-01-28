import { test, expect } from "@playwright/test";
// import { assert } from "console";

test.describe("Landing page", () => {
  test("verify home page content", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await expect(page).toHaveURL("http://localhost:3000/");
    await expect(page).toHaveTitle("CuetPS");
    await expect(
      page.getByRole("heading", { name: "Welcome to CuetPS" })
    ).toHaveText("Welcome to CuetPS");
    await expect(page.getByText("Discover and share amazing")).toBeVisible();
    await expect(page.getByText("Share Your PhotosUpload and")).toBeVisible();
    await expect(page.getByText("Browse GalleryExplore")).toBeVisible();
    await expect(page.getByText("Join ExhibitionsParticipate")).toBeVisible();
  });

  test("check explore gallery button", async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("link", { name: "Explore Gallery" }).click();
    await expect(page).toHaveURL("http://localhost:3000/gallery");
  });
});

test.describe("Login page", () => {
  test("verify sections of login page", async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    const email_field = page.getByPlaceholder("Email address");
    const pass_field = page.getByPlaceholder("Password");
    const login_btn = page.getByRole("button", { name: "Sign in" });

    await expect(
      page.getByRole("heading", { name: "Welcome Back" })
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: "Register now" })
    ).toBeVisible();
    await page.getByRole("link", { name: "Register now" }).click();
    await expect(page).toHaveURL("http://localhost:3000/signup");
    await page.goBack();

    await expect(email_field).toBeVisible();
    await expect(email_field).toBeEditable();
    await expect(pass_field).toBeVisible();
    await expect(pass_field).toBeEditable();
    await expect(login_btn).toBeVisible();
  });

  test("login works", async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    const email_field = page.getByPlaceholder("Email address");
    const pass_field = page.getByPlaceholder("Password");
    const login_btn = page.getByRole("button", { name: "Sign in" });

    await email_field.click();
    await email_field.fill("shadman@mail.com");
    await pass_field.click();
    await pass_field.fill("pass");
    await login_btn.click();
    await expect(page.getByRole("button", { name: "Login" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
    await page.getByRole("button", { name: "Logout" }).click();
  });

  test("login doens't work with wrong email or password", async ({ page }) => {
    await page.goto("http://localhost:3000/login");
    await page.getByPlaceholder("Email address").click();
    await page.getByPlaceholder("Email address").fill("asdf@m.com");
    await page.getByPlaceholder("Email address").press("Tab");
    await page.getByPlaceholder("Password").fill("pioqwuoi");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Invalid email or password")).toBeVisible();

    await page.goto("http://localhost:3000/login");
    await page.getByPlaceholder("Email address").click();
    await page.getByPlaceholder("Email address").fill("shadman@mail.com");
    await page.getByPlaceholder("Email address").press("Tab");
    await page.getByPlaceholder("Password").fill("12340970814");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Invalid email or password")).toBeVisible();

    await page.goto("http://localhost:3000/login");
    await page.getByPlaceholder("Email address").click();
    await page.getByPlaceholder("Email address").fill("shadman-wrong@mail.cpm");
    await page.getByPlaceholder("Email address").press("Tab");
    await page.getByPlaceholder("Password").fill("pass");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Invalid email or password")).toBeVisible();

    await page.goto("http://localhost:3000/login");
    await page.getByPlaceholder("Email address").click();
    await page.getByPlaceholder("Email address").fill("shadman@mail.com");
    await page.getByPlaceholder("Email address").press("Tab");
    await page.getByPlaceholder("Password").fill("pass");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("button", { name: "Logout" })).toBeVisible();
    await page.getByRole("button", { name: "Logout" }).click();
  });
});

test.describe("Signup page", () => {
  test("verify sections of login page", async ({ page }) => {
    await page.goto("http://localhost:3000/signup");
    const name = page.getByPlaceholder("Enter your full name");
    const email = page.getByPlaceholder("Enter your email");
    const pass = page.getByPlaceholder("Enter a secure password");
    const signup_btn = page.getByRole("button", { name: "Sign Up" });

    expect(name).toBeVisible();
    expect(name).toBeEditable();
    expect(email).toBeVisible();
    expect(email).toBeEditable();
    expect(pass).toBeVisible();
    expect(pass).toBeEditable();
    expect(signup_btn).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Create Your Account" })
    ).toBeVisible();
  });

  test("signup works", async ({ page }) => {
    await page.goto("http://localhost:3000/signup");
    await page.getByPlaceholder("Enter your full name").click();
    await page.getByPlaceholder("Enter your full name").fill("shadman");
    await page.getByPlaceholder("Enter your email").click();
    await page.getByPlaceholder("Enter your email").fill("shadman@mail.com");
    await page.getByPlaceholder("Enter a secure password").click();
    await page.getByPlaceholder("Enter a secure password").fill("pass");
    await page.getByRole("heading", { name: "Create Your Account" }).click();
    await page.getByRole("button", { name: "Sign Up" }).click();
  });
});

test.describe("Gallery page", () => {
  test("verify gallery content", async ({ page }) => {
    await page.goto("http://localhost:3000/gallery");
    await expect(
      page.getByRole("heading", { name: "Photo Gallery" })
    ).toBeVisible();
    await expect(await page.locator("img").count()).toBeGreaterThan(5);
  });
});

test.describe("Exhibition page", () => {
  test("verify exhibition content", async ({ page }) => {
    await page.goto("http://localhost:3000/exhibitions");
    await page.getByRole("link", { name: "Nature Photography Nature" }).click({
      button: "right",
    });
    await expect(
      page.getByRole("heading", { name: "Exhibitions" })
    ).toBeVisible();
    await page.getByRole("link", { name: "Nature Photography Nature" }).click();
    await expect(page).toHaveURL(/http:\/\/localhost:3000\/exhibitions\/\d+/);
    await expect(await page.locator("img").count()).toBeGreaterThan(5);
  });
});
