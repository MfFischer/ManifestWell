/**
 * E2E Tests - Meal Tracking Flow
 * Tests complete meal tracking user journey
 */

import { test, expect } from '@playwright/test'

test.describe('Meal Tracking', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /submit|continue/i }).click()

    // Navigate to nutrition tracker
    await page.goto('/?tab=nutrition')
  })

  test('should display nutrition tracker page', async ({ page }) => {
    await expect(page.getByText(/nutrition|meals/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /add meal|log meal/i })).toBeVisible()
  })

  test('should open add meal dialog', async ({ page }) => {
    await page.getByRole('button', { name: /add meal|log meal/i }).click()

    // Dialog should be visible
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByLabel(/meal name/i)).toBeVisible()
    await expect(page.getByLabel(/meal type|type/i)).toBeVisible()
    await expect(page.getByLabel(/calories/i)).toBeVisible()
  })

  test('should validate meal form', async ({ page }) => {
    await page.getByRole('button', { name: /add meal|log meal/i }).click()

    // Try to submit empty form
    await page.getByRole('button', { name: /save|add|create/i }).click()

    // Should show validation errors
    await expect(page.getByText(/name.*required/i)).toBeVisible()
    await expect(page.getByText(/calories.*required/i)).toBeVisible()
  })

  test('should create meal successfully', async ({ page }) => {
    await page.getByRole('button', { name: /add meal|log meal/i }).click()

    // Fill form
    await page.getByLabel(/meal name/i).fill('Chicken Salad')
    await page.getByLabel(/meal type|type/i).selectOption('lunch')
    await page.getByLabel(/calories/i).fill('450')
    await page.getByLabel(/protein/i).fill('35')
    await page.getByLabel(/carbs/i).fill('25')
    await page.getByLabel(/fat/i).fill('18')
    await page.getByLabel(/notes/i).fill('Healthy lunch with grilled chicken')

    // Submit
    await page.getByRole('button', { name: /save|add|create/i }).click()

    // Should close dialog
    await expect(page.getByRole('dialog')).not.toBeVisible()

    // Should see the new meal in the list
    await expect(page.getByText('Chicken Salad')).toBeVisible()
    await expect(page.getByText('450')).toBeVisible()

    // Should show success message
    await expect(page.getByText(/meal.*added|success/i)).toBeVisible()
  })

  test('should display meal details', async ({ page }) => {
    // Create a meal first
    await page.getByRole('button', { name: /add meal|log meal/i }).click()
    await page.getByLabel(/meal name/i).fill('Test Meal')
    await page.getByLabel(/meal type|type/i).selectOption('breakfast')
    await page.getByLabel(/calories/i).fill('300')
    await page.getByRole('button', { name: /save|add|create/i }).click()

    // Click on the meal to view details
    await page.getByText('Test Meal').click()

    // Should show detailed information
    await expect(page.getByText(/breakfast/i)).toBeVisible()
    await expect(page.getByText(/300.*cal/i)).toBeVisible()
  })

  test('should edit meal', async ({ page }) => {
    // Create a meal
    await page.getByRole('button', { name: /add meal|log meal/i }).click()
    await page.getByLabel(/meal name/i).fill('Original Meal')
    await page.getByLabel(/meal type|type/i).selectOption('lunch')
    await page.getByLabel(/calories/i).fill('400')
    await page.getByRole('button', { name: /save|add|create/i }).click()

    // Click edit button
    await page.getByRole('button', { name: /edit/i }).first().click()

    // Modify fields
    await page.getByLabel(/meal name/i).fill('Updated Meal')
    await page.getByLabel(/calories/i).fill('500')

    // Save
    await page.getByRole('button', { name: /save|update/i }).click()

    // Should see updated meal
    await expect(page.getByText('Updated Meal')).toBeVisible()
    await expect(page.getByText('500')).toBeVisible()
    await expect(page.getByText('Original Meal')).not.toBeVisible()
  })

  test('should delete meal', async ({ page }) => {
    // Create a meal
    await page.getByRole('button', { name: /add meal|log meal/i }).click()
    await page.getByLabel(/meal name/i).fill('Meal to Delete')
    await page.getByLabel(/meal type|type/i).selectOption('snack')
    await page.getByLabel(/calories/i).fill('200')
    await page.getByRole('button', { name: /save|add|create/i }).click()

    // Click delete button
    await page.getByRole('button', { name: /delete/i }).first().click()

    // Confirm deletion
    await page.getByRole('button', { name: /confirm|yes|delete/i }).click()

    // Should no longer see the meal
    await expect(page.getByText('Meal to Delete')).not.toBeVisible()

    // Should show success message
    await expect(page.getByText(/deleted|removed/i)).toBeVisible()
  })

  test('should calculate daily totals', async ({ page }) => {
    // Add multiple meals
    const meals = [
      { name: 'Breakfast', type: 'breakfast', calories: 300 },
      { name: 'Lunch', type: 'lunch', calories: 500 },
      { name: 'Dinner', type: 'dinner', calories: 600 }
    ]

    for (const meal of meals) {
      await page.getByRole('button', { name: /add meal|log meal/i }).click()
      await page.getByLabel(/meal name/i).fill(meal.name)
      await page.getByLabel(/meal type|type/i).selectOption(meal.type)
      await page.getByLabel(/calories/i).fill(meal.calories.toString())
      await page.getByRole('button', { name: /save|add|create/i }).click()
      await page.waitForTimeout(500) // Wait for API
    }

    // Should show total calories (1400)
    await expect(page.getByText(/1,?400.*total|total.*1,?400/i)).toBeVisible()
  })

  test('should filter meals by date', async ({ page }) => {
    // Create meal for today
    await page.getByRole('button', { name: /add meal|log meal/i }).click()
    await page.getByLabel(/meal name/i).fill('Today Meal')
    await page.getByLabel(/meal type|type/i).selectOption('lunch')
    await page.getByLabel(/calories/i).fill('400')
    await page.getByRole('button', { name: /save|add|create/i }).click()

    // Use date picker to filter
    const datePicker = page.getByRole('button', { name: /date|calendar/i })
    if (await datePicker.isVisible()) {
      await datePicker.click()

      // Select yesterday
      await page.getByRole('button', { name: /previous day|yesterday/i }).click()

      // Should not see today's meal
      await expect(page.getByText('Today Meal')).not.toBeVisible()
    }
  })
})

test.describe('Offline Mode', () => {
  test('should work offline', async ({ page, context }) => {
    // Login
    await page.goto('/login')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /submit|continue/i }).click()
    await page.goto('/?tab=nutrition')

    // Go offline
    await context.setOffline(true)

    // Should show offline indicator
    await expect(page.getByText(/offline|no.*connection/i)).toBeVisible()

    // Should still be able to add meals
    await page.getByRole('button', { name: /add meal|log meal/i }).click()
    await page.getByLabel(/meal name/i).fill('Offline Meal')
    await page.getByLabel(/meal type|type/i).selectOption('snack')
    await page.getByLabel(/calories/i).fill('150')
    await page.getByRole('button', { name: /save|add|create/i }).click()

    // Meal should be added locally
    await expect(page.getByText('Offline Meal')).toBeVisible()

    // Go back online
    await context.setOffline(false)

    // Should sync
    await page.waitForTimeout(2000) // Wait for sync
    await expect(page.getByText(/synced|online/i)).toBeVisible()
  })
})
