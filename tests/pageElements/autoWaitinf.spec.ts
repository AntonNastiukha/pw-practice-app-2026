import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
    await page.goto(process.env.URL!)
    await page.getByText("Button Triggering AJAX Request").click()
})

test.skip('auto waiting', async ({ page }) => {
    const successField = page.locator('.bg-success')

    //wait foe selector
    // await page.waitForSelector('.bg-success')

    //wait for response
    // await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    //wait for all calls are complirted (NOT RECOMENDET)
    await page.waitForLoadState('networkidle')

    const text = await successField.allTextContents()
    expect(successField).toContainText('Data loaded with AJAX get request.')
})