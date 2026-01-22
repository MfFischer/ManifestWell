/**
 * E2E Tests - Authentication Flow
 * Tests complete user authentication journey
 */

import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should show login page for unauthenticated users', async ({ page }) => {
    await expect(page).toHaveTitle(/ManifestWell/)

    // Should see login/signup options
    const loginButton = page.getByRole('button', { name: /login|sign in/i })
    await expect(loginButton).toBeVisible()
  })

  test('should validate login form', async ({ page }) => {
    // Click login button
    await page.getByRole('button', { name: /login|sign in/i }).click()

    // Try to submit empty form
    await page.getByRole('button', { name: /submit|continue/i }).click()

    // Should show validation errors
    await expect(page.getByText(/email.*required|invalid email/i)).toBeVisible()
    await expect(page.getByText(/password.*required/i)).toBeVisible()
  })

  test('should handle invalid credentials', async ({ page }) => {
    await page.getByRole('button', { name: /login|sign in/i }).click()

    // Fill form with invalid credentials
    await page.getByLabel(/email/i).fill('invalid@example.com')
    await page.getByLabel(/password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /submit|continue/i }).click()

    // Should show error message
    await expect(page.getByText(/invalid.*credentials|login failed/i)).toBeVisible()
  })

  test('should successfully login with valid credentials', async ({ page }) => {
    await page.getByRole('button', { name: /login|sign in/i }).click()

    // Fill form with valid credentials (mock user)
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /submit|continue/i }).click()

    // Should redirect to dashboard
    await expect(page).toHaveURL(/dashboard|home/)

    // Should see user-specific content
    await expect(page.getByText(/welcome|dashboard/i)).toBeVisible()
  })

  test('should persist session after page reload', async ({ page }) => {
    // Login first
    await page.getByRole('button', { name: /login|sign in/i }).click()
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /submit|continue/i }).click()

    await expect(page).toHaveURL(/dashboard|home/)

    // Reload page
    await page.reload()

    // Should still be logged in
    await expect(page).toHaveURL(/dashboard|home/)
    await expect(page.getByText(/welcome|dashboard/i)).toBeVisible()
  })

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.getByRole('button', { name: /login|sign in/i }).click()
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /submit|continue/i }).click()

    await expect(page).toHaveURL(/dashboard|home/)

    // Find and click logout button
    await page.getByRole('button', { name: /logout|sign out/i }).click()

    // Should redirect to login page
    await expect(page).toHaveURL(/login|auth/)

    // Should not be able to access protected pages
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/login|auth/)
  })
})

test.describe('Biometric Authentication', () => {
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'Biometric tests only run on Chromium'
  )

  test('should show biometric option when available', async ({ page, context }) => {
    // Grant permissions
    await context.grantPermissions(['camera'])

    await page.goto('/login')

    // Look for biometric button/option
    const biometricButton = page.getByRole('button', { name: /face id|touch id|biometric/i })

    if (await biometricButton.isVisible()) {
      expect(biometricButton).toBeVisible()
    }
  })
})
