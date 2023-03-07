import { test, expect, Page } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

let page: Page

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()
})

test.afterAll(async () => {
  await page.close()
})

test('auth', async () => {
  await page.goto(`https://${process.env.URL}/`)
  await page.getByRole('link', { name: 'Войти' }).click()

  await expect(page.getByRole('button', { name: 'Войти с паролем' })).toHaveText('Войти с паролем')

  await page.getByRole('button', { name: 'Войти с паролем', exact: true }).click()
  await page.getByRole('button', { name: 'Войти с паролем', exact: true }).click()
  await page.getByPlaceholder('Электронная почта или телефон').click()
  await page.getByPlaceholder('Электронная почта или телефон').fill(`${process.env.LOGIN}`)
  await page.getByPlaceholder('Пароль').click()
  await page.getByPlaceholder('Пароль').fill(`${process.env.PASSWORD}`)
  await page.getByRole('button', { name: 'Войти', exact: true }).click()
})

test('search', async () => {
  await page.getByPlaceholder('Профессия, должность или компания').click()
  await page.getByPlaceholder('Профессия, должность или компания').fill(`${process.env.VACANCY}`)
  await page.getByPlaceholder('Профессия, должность или компания').press('Enter')
})

test('filter', async () => {
  await page.getByRole('textbox', { name: 'Исключить слова, через запятую' }).click()
  await page
    .getByRole('textbox', { name: 'Исключить слова, через запятую' })
    .fill('senior,angular,vue,python,c#,java,php')

  await page.getByRole('textbox', { name: 'Исключить слова, через запятую' }).press('Enter')

  expect(
    page.locator('span').filter({ hasText: 'В описании вакансии' }).first().click()
  ).toBeTruthy()
})

// если поменялся урл страницы, то возвращаемся назад и кликаем дальше
test('click the first page', async () => {
  for (const job of await page.locator('.serp-item-controls > a').all()) {
    await job.click()
  }
})

test('click next page', async () => {
  await page.getByRole('link', { name: 'дальше' }).click()
})

test('click the second page', async () => {
  for (const job of await page.locator('.serp-item-controls > a').all()) {
    await job.click()
  }
})

test('click next page', async () => {
  await page.getByRole('link', { name: 'дальше' }).click()
})
