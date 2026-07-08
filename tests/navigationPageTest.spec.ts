import { test } from "@playwright/test"
import { PageManager } from "../pageObjects/pageManaget"
import { faker } from '@faker-js/faker'

test.beforeEach(async ({ page }) => {
    await page.goto("/")
})

test('navigate to form page', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formsLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toasterPage()
    await pm.navigateTo().tooltipPage()
})

test('fill in Using the Grid form', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formsLayoutsPage()
    await pm.onFormLayoutsPage().fillInAllFieldsAndSubmitUsingTheGridForm("Anton_n@gmail.com", "123qwe", "Option 2")
})

test('fill in Inline form', async ({ page }) => {
    const pm = new PageManager(page)
    const fullName = faker.person.fullName()
    const email = `${fullName.split(" ").join("")}${faker.number.int(100)}@gmail.com`
    await pm.navigateTo().formsLayoutsPage()
    await pm.onFormLayoutsPage().fillInAllFieldsAndSubmitInlineForm(fullName, email, true)
})

test('form date picker test', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.navigateTo().datepickerPage()
    await pm.onDatePickerPage().openFormPicker()

    const date = new Date()
    date.setDate(date.getDate() + 15)
    await pm.onDatePickerPage().selectDateAndVereify(date)
})

test('range day date picker test', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.navigateTo().datepickerPage()
    await pm.onDatePickerPage().openDatePickerWithRange()

    const date = new Date()
    const startDate = new Date(date)
    startDate.setDate(date.getDate() + 5)
    const endDate = new Date(date)
    endDate.setDate(date.getDate() + 10)
    await pm.onDatePickerPage().selectDatesAndVereify(startDate, endDate)
})
