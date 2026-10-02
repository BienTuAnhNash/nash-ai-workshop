import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear()
  })
})

test('shows sign in page', async ({ page }) => {
  await page.goto('/signin')
  await expect(page).toHaveURL(/\/signin\/?$/)

  await expect(page.getByText('Sign In', { exact: true })).toBeVisible()
  await expect(page.getByLabel('Email')).toBeVisible()
  await expect(page.getByLabel('Password')).toBeVisible()
})

test('sign up then sign in successfully', async ({ page }) => {
  const email = `qc-${Date.now()}@demo.local`
  const password = '123456'

  await page.goto('/signup')
  await page.getByLabel('Name').fill('QC Demo')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Submit' }).click()

  await page.waitForURL(/\/signin\/?$/, { timeout: 10000 })
  await expect(page.getByLabel('Name')).toHaveCount(0, { timeout: 10000 })
  await expect(page.getByText('Sign In', { exact: true })).toBeVisible()

  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Submit' }).click()

  await expect(page).toHaveURL(/\/$/, { timeout: 10000 })
})
