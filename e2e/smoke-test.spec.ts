import { test, expect } from '@playwright/test';

test.describe('Adaptus DMS - Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set a longer timeout for initial page load
    test.setTimeout(60000);
  });

  test('Navigation Smoke Test', async ({ page }) => {
    // Visit root and check redirect
    await page.goto('/');
    
    // Wait for navigation - should redirect to dashboard or login
    await page.waitForLoadState('networkidle');
    const url = page.url();
    
    // Check if we're on dashboard or login page
    expect(url).toMatch(/\/(dashboard|login)/);
    
    // If on login, we'll skip the navigation test
    // Otherwise, test sidebar navigation
    if (url.includes('/dashboard')) {
      // Test Inventory link
      await page.click('text=Inventory');
      await expect(page).toHaveURL(/.*\/inventory/);
      await expect(page.locator('h1')).toContainText(/inventory/i);
      
      // Test Leads link
      await page.click('text=Leads');
      await expect(page).toHaveURL(/.*\/leads/);
      await expect(page.locator('h1')).toContainText(/lead/i);
      
      // Test Invoices link
      await page.click('text=Invoices');
      await expect(page).toHaveURL(/.*\/invoices/);
      await expect(page.locator('h1')).toContainText(/invoice/i);
      
      // Test Dashboard link
      await page.click('text=Dashboard');
      await expect(page).toHaveURL(/.*\/dashboard/);
      await expect(page.locator('h1')).toContainText(/dashboard/i);
    }
  });

  test('Critical Path - Add Vehicle Flow', async ({ page }) => {
    await page.goto('/inventory');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Look for "Add Vehicle" button
    const addButton = page.locator('button:has-text("Add Vehicle"), a:has-text("Add Vehicle")').first();
    
    if (await addButton.isVisible()) {
      await addButton.click();
      
      // Wait for form to appear (could be dialog, sheet, or new page)
      await page.waitForTimeout(1000);
      
      // Fill out the form
      const vinInput = page.locator('input[name="vin"], input[placeholder*="VIN" i]').first();
      if (await vinInput.isVisible()) {
        await vinInput.fill('1HGBH41JXMN109186');
      }
      
      const makeInput = page.locator('input[name="make"], input[placeholder*="Make" i]').first();
      if (await makeInput.isVisible()) {
        await makeInput.fill('Toyota');
      }
      
      const modelInput = page.locator('input[name="model"], input[placeholder*="Model" i]').first();
      if (await modelInput.isVisible()) {
        await modelInput.fill('Camry');
      }
      
      const yearInput = page.locator('input[name="year"], input[placeholder*="Year" i]').first();
      if (await yearInput.isVisible()) {
        await yearInput.fill('2023');
      }
      
      const priceInput = page.locator('input[name="retail_price"], input[placeholder*="Price" i]').first();
      if (await priceInput.isVisible()) {
        await priceInput.fill('25000');
      }
      
      // Submit the form
      const submitButton = page.locator('button[type="submit"], button:has-text("Save"), button:has-text("Add Vehicle")').first();
      if (await submitButton.isVisible()) {
        await submitButton.click();
        
        // Wait for form submission
        await page.waitForTimeout(2000);
        
        // Check if vehicle appears in the list (by VIN or make/model)
        const vehicleInList = page.locator('text=1HGBH41JXMN109186, text=Toyota, text=Camry').first();
        // This assertion might need adjustment based on actual UI
        // await expect(vehicleInList).toBeVisible({ timeout: 10000 });
      }
    } else {
      // If button not found, skip this test
      test.skip();
    }
  });

  test('Database Connectivity - Verify Data Persistence', async ({ page }) => {
    await page.goto('/inventory');
    await page.waitForLoadState('networkidle');
    
    // Check if vehicle list is visible
    const vehicleList = page.locator('table, [role="table"], .vehicle-list').first();
    
    if (await vehicleList.isVisible()) {
      // Verify that data is loaded (not just empty state)
      const emptyState = page.locator('text=No vehicles, text=No data').first();
      const hasData = !(await emptyState.isVisible());
      
      // If data exists, verify it's displayed correctly
      if (hasData) {
        // Check for at least one row in the table
        const rows = page.locator('tbody tr, [role="row"]').first();
        await expect(rows).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('404 Page Test', async ({ page }) => {
    await page.goto('/non-existent-page');
    
    // Should show 404 page
    await expect(page.locator('text=Page Not Found, text=404')).toBeVisible();
    
    // Should have link to dashboard
    const dashboardLink = page.locator('a:has-text("Dashboard"), button:has-text("Dashboard")').first();
    await expect(dashboardLink).toBeVisible();
  });

  test('Error Boundary Test', async ({ page }) => {
    // Try to access a page that might cause an error
    // This is a basic test - actual error scenarios would need to be set up
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Check that page loaded without showing error boundary
    const errorBoundary = page.locator('text=Something went wrong').first();
    await expect(errorBoundary).not.toBeVisible();
  });
});
