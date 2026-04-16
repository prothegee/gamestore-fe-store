import { test, expect } from '@playwright/test';

test.describe('GameStore E2E Flow', () => {
  test('should navigate to store, login, search and add to cart', async ({ page }) => {
    // 1. Visit landing page
    await page.goto('/en/home');
    await expect(page).toHaveTitle(/Game Store/);

    // 2. Go to Login
    await page.click('text=login');
    await expect(page).toHaveURL(/\/en\/login/);

    // 3. Login with demouser:demouser
    await page.fill('input[type="text"]', 'demouser');
    await page.fill('input[type="password"]', 'demouser');
    await page.click('button:has-text("Sign In")');

    // 4. Should be redirected to home and see username
    await expect(page).toHaveURL(/\/en\/home/);
    await expect(page.locator('nav')).toContainText('demouser');

    // 5. Navigate to Store
    await page.click('nav a:text-is("STORE")');
    await expect(page).toHaveURL(/\/en\/store/);

    // 6. Search for a game
    const searchInput = page.locator('input[placeholder="search"]');
    await searchInput.fill('Cyberpunk');
    
    // Wait for debounce and results
    await page.waitForTimeout(1000); 
    await expect(page.locator('text=Cyberpunk 2077')).toBeVisible();

    // 7. Click on the game
    await page.click('text=Cyberpunk 2077');
    await expect(page).toHaveURL(/\/en\/game\/1/);

    // 8. Add to cart
    await page.click('button:has-text("Add to Cart")');
    
    // 9. Check cart count in Navbar
    const cartButton = page.locator('a[href*="/cart"]');
    await expect(cartButton).toContainText('1');

    // 10. Go to Cart page
    await cartButton.click();
    await expect(page).toHaveURL(/\/en\/cart/);
    await expect(page.locator('h1')).toContainText('Your Shopping Cart');
    await expect(page.locator('text=Cyberpunk 2077')).toBeVisible();
    // The UI shows the quantity as a number between - and + buttons
    // Use a more specific selector to avoid matching the cart count in Navbar
    await expect(page.locator('main span:text-is("1")')).toBeVisible();

    // 11. Test quantity increment by adding again
    await page.goto('/en/game/1');
    await page.click('button:has-text("Add to Cart")');
    await page.goto('/en/cart');
    await expect(page.locator('main span:text-is("2")')).toBeVisible();
  });

  test('should switch language', async ({ page }) => {
    await page.goto('/en/home');
    
    // Open language dropdown
    await page.click('button:has-text("LANG: en")');
    
    // Click Indonesian (it's a Link, not a button)
    await page.click('a:has-text("Indonesian")');
    
    // Check URL and content
    await expect(page).toHaveURL(/\/id\/home/);
    await expect(page.locator('nav')).toContainText('TOKO');
    await expect(page.locator('nav')).toContainText('LANG: id');
  });
});
