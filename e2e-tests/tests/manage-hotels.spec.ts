import { test, expect } from '@playwright/test';
import path from 'path';

const UI_URL = 'http://localost:5173/';

test.beforeEach(async ({ page }) => {
    await page.goto(UI_URL);

    // get the sign in button
    await page.getByRole("link", { name: "Sign In" }).click();

    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

    await page.locator("[name=email]").fill("neha@gmail.com");
    await page.locator("[name=password").fill("neha123");

    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.getByText("Sign in successful!")).toBeVisible();
});

test('should allow user to add the hotel', async ({ page }) => {
    await page.goto(`${UI_URL}add-hotel`)
    
    await page.locator("[name='name']").fill("Test Hotel");
    await page.locator("[name='city']").fill("Test City");
    await page.locator("[name='country']").fill("Test Country");
    await page.locator("[name='description']").fill("Test Description");
    await page.locator("[name='pricePerNight']").fill("1000");
    await page.selectOption('select[name="starRaring"]', "3");
    await page.getByText("Budget").click();
    await page.getByLabel('Spa').check();
    await page.getByLabel('Parking').check();

    await page.locator('[name="adultCount"]').fill("4");
    await page.locator('[name="childCount"]').fill("2");

    await page.setInputFiles('[name="imageFiles"]', [
        path.join(__dirname, "files", "1.jpg"),
    ]);

    await page.getByRole('button', {name: "Save"}).click();
    await expect(page.getByText("Hotel Saved!")).toBeVisible();

});

test("should display all Hotels", async ({ page }) => {
    await page.goto(`${UI_URL}my-hotels`);
    await expect(page.getByText("Royal Inn")).toBeVisible();
    await expect(page.getByText("heart of the city")).toBeVisible();
    await expect(page.getByText("Hubli, India")).toBeVisible();
    await expect(page.getByText("Family")).toBeVisible();
    await expect(page.getByText("$5799 per night")).toBeVisible();
    await expect(page.getByText("8 adults, 4 children")).toBeVisible();
    await expect(page.getByText("4 Star Rating")).toBeVisible();

    await expect(page.getByRole('link', {name: "View Details"}).first()).toBeVisible();
    await expect(page.getByRole('link', {name: "Add Hotel"})).toBeVisible();
});

test("should edit hotel", async ({ page }) => {
    await page.goto(`${UI_URL}my-hotels`);
    
    await page.getByRole("link", { name: "View Details" }).click();
    await page.waitForSelector('[name="name"]', { state: 'attached' });
    await expect(page.locator('[name="name"]')).toHaveValue('Royal Inn');
    await page.locator('[name="name"]').fill("Grand Hyatt Inn");
    await page.getByRole('button', {name: "Save"}).click();
    await expect(page.getByText("Hotel Saved!")).toBeVisible();

    await page.reload();
    await expect(page.locator('[name="name"]')).toHaveValue("Grand Hyatt Inn");
    await page.getByRole("button", {name: "Save"}).click();

});





