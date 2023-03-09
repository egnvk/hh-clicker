import { test, expect, Page } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

let page: Page
let countOfPages = [...Array(Number(`${process.env.NUMBEROFPAGES}`)).keys()].map((i) => i + 1)

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()
  page.setViewportSize({ width: 1400, height: 1300 })
})

test.afterAll(async () => {
  await page.close()
})

test('auth', async () => {
  await page.goto(`https://${process.env.URL}/`)
  await page.getByRole('link', { name: 'Войти' }).click()

  await page.locator('.account-login-tile').first().click()
  await expect(page.getByRole('button', { name: 'Войти с паролем' })).toHaveText('Войти с паролем')
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
    .fill(`${process.env.EXCLUDE}`)

  await page.getByRole('textbox', { name: 'Исключить слова, через запятую' }).press('Enter')

  await page.locator('legend').filter({ hasText: 'Ключевые слова' }).locator('span').click()
  await page
    .locator('span')
    .filter({ hasText: 'В описании вакансии' })
    .first()
    .click({ button: 'left' })
})

// кликаем по 4 страницам, это около 200 кликов
for (const num in countOfPages) {
  test('click on page number ' + num, async () => {
    const currentURL = page.url()
    for (const job of await page.locator('.serp-item-controls > a').all()) {
      await job.click().then(() =>
        setTimeout(() => {
          if (currentURL !== page.url()) {
            page.goBack()

            // после возврата к общему списку вакансий, чекбокс стоит в положении true
            // в связи с чем, в список попадают вакансии без учета слов из переменной EXCLUDE
            // можно принудительно его выключить, просто раскоментировав код ниже
            // но я это не тестил, проверю позже
            // в теории это должно сработать), или нет) хахаха
            // page.locator('legend').filter({ hasText: 'Ключевые слова' }).locator('span').click()
            // page
            //   .locator('span')
            //   .filter({ hasText: 'В описании вакансии' })
            //   .first()
            //   .click({ button: 'left' })
          }

          page
            .locator('.bloko-modal-close-button')
            .isVisible()
            .then(() => page.locator('.bloko-modal-close-button').click())
        }, 4000)
      )
    }
  })

  test('click on next page number ' + num, async () => {
    await page.getByRole('link', { name: 'дальше' }).click()
  })
}
