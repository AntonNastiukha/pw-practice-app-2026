import { expect, test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.getByText("Forms").click()
    await page.getByText("Form Layouts").click()
})

test("locator syntax rules", async ({ page }) => {
    //By Tag name
    page.locator('input')

    //By ID
    page.locator('#inputEmail1')

    //By Class value
    page.locator('.shape-rectangle')

    //By attribute
    page.locator('[placeholder="Email"]')

    //By Class value (full)
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //Combine different selectors
    page.locator('input[placeholder="Email"]')

    //By XPath (NOT RECOMMENDED)
    page.locator('//*[@id="inputEmail1"]')

    //By partial text match
    page.locator(':text("Using")')

    //By exact text match
    page.locator(':text-is("Using the Grid")')

})

test('user facing locators', async ({ page }) => {
    await page.getByRole('textbox', { name: "Email" }).first().click()
    await page.getByRole('button', { name: "Sign in" }).first().click()
    await page.getByLabel('Email').first().click()
    await page.getByPlaceholder('Jane Doe').click()
    await page.getByText('Using the Grid').click()
    await page.getByTestId('Anton').click()
    await page.getByTitle('IoT Dashboard').click()
})

test('locating child element', async ({ page }) => {
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()
    await page.locator('nb-card').locator(':text-is("Option 2")').click()
    await page.locator('nb-card').getByRole('button', { name: "Sign in" }).first().click()
    await page.locator('nb-card').nth(1).getByRole('button', { name: "Sign in" }).click()
})

test('locating parent element', async ({ page }) => {
    await page.locator('nb-card', { hasText: 'Using the Grid' }).getByRole('textbox', { name: "Email" }).click()
    await page.locator('nb-card', { has: page.locator('#inputEmail1') }).getByRole('textbox', { name: "Email" }).click()
    await page.locator('nb-card').filter({ hasText: "Basic form" }).getByRole('textbox', { name: "Email" }).click()
    await page.locator('nb-card').filter({ has: page.locator(".status-danger") }).getByRole('button').click()
    await page.locator('nb-card').filter({ has: page.locator("nb-checkbox") }).filter({ hasText: "Sign in" }).getByRole('button').click()
    await page.locator(':text-is("Using the Grid")').locator("..").getByRole('textbox', { name: "Email" }).click()
})

test('reusing locators', async ({ page }) => {
    const frame = page.locator('nb-card', { hasText: 'Using the Grid' })
    const emailField = frame.getByRole('textbox', { name: "Email" })
    const passwordField = frame.getByRole('textbox', { name: "Password" })
    const signButton = frame.getByRole('button')

    await emailField.fill("Anton_n@gmail.com")
    await passwordField.fill("123qwe")
    await signButton.click()

    await expect(emailField).toHaveValue("Anton_n@gmail.com")
})

test('extracting value', async ({ page }) => {
    const frame = page.locator('nb-card').filter({ hasText: "Basic form" })
    const buttonText = await frame.getByRole('button').textContent()
    expect(buttonText).toEqual("Submit")

    const allRadioButtonLables = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonLables).toContain("Option 1")

    const text: string = "qwe@gmail.com"
    const emailField = frame.getByRole('textbox', { name: "Email" })
    await emailField.fill(text)
    const inputValue = await emailField.inputValue()
    expect(inputValue).toEqual(text)
    const placeHolderValue = await emailField.getAttribute("placeholder")
    expect(placeHolderValue).toEqual("Email")
})

test('assertions', async ({ page }) => {
    const button = page.locator('nb-card').filter({ hasText: "Basic form" }).getByRole('button')

    const buttonText = await button.textContent()
    expect(buttonText).toEqual("Submit")

    expect(button).toHaveText("Submit")

    expect.soft(button).toHaveText("Submit")
    await button.click()
})