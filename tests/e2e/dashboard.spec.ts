import { expect, test } from '@playwright/test'

test('shows the banking dashboard and completes a transfer', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /good morning, /i })).toBeVisible()
  await expect(page.locator('.balance-amount')).toHaveText('$24,680.50')

  await page.getByLabel('Recipient', { exact: true }).fill('Taylor Reed')
  await page.getByLabel('Amount', { exact: true }).fill('125.75')
  await page.getByRole('button', { name: /send money/i }).click()

  await expect(page.getByRole('status')).toHaveText('Transfer of $125.75 sent to Taylor Reed.')
  await expect(page.locator('.balance-amount')).toHaveText('$24,554.75')
  await expect(page.getByText('Taylor Reed').first()).toBeVisible()
})

test('validates a transfer that exceeds the available balance', async ({ page }) => {
  await page.goto('/')

  await page.getByLabel('Recipient', { exact: true }).fill('Taylor Reed')
  await page.getByLabel('Amount', { exact: true }).fill('999999')
  await page.getByRole('button', { name: /send money/i }).click()

  await expect(page.getByRole('alert')).toHaveText('This transfer exceeds your available balance.')
  await expect(page.locator('.balance-amount')).toHaveText('$24,680.50')
})
