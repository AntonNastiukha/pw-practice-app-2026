import { expect, Page, Locator } from "@playwright/test"
import { test } from "../../test-options"

test.beforeEach(async ({ page }) => {
    await page.goto("/")
})

test.describe('form layouts page', () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText("Forms").click()
        await page.getByText("Form Layouts").click()
    })

    test('input fiels', async ({ page }) => {
        const emailInput = page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: "Email" })
        const text: string = "test@test.com"
        await emailInput.fill(text)
        await emailInput.clear()
        await emailInput.pressSequentially(text, { delay: 500 })

        expect(emailInput).toHaveValue(text)
    })

    test('radio buttons', async ({ page }) => {
        const gridBox = page.locator('nb-card', { hasText: "Using the Grid" })
        const firstRadioButton = gridBox.getByRole('radio', { name: "Option 1" })
        const secondRadioButton = gridBox.getByRole('radio', { name: "Option 2" })

        expect(await firstRadioButton.isChecked()).toBeFalsy()

        await firstRadioButton.check({ force: true })

        await expect(firstRadioButton).toBeChecked()

        await secondRadioButton.check({ force: true })
        await expect(firstRadioButton).not.toBeChecked()
    })
})

test('checkboxes', async ({ page }) => {
    await page.getByText("Modal & Overlays").click()
    await page.getByText("Toastr").click()

    const firstCheckbox = page.getByRole('checkbox', { name: "Hide on click" })
    const secondCheckbox = page.getByRole('checkbox', { name: "Prevent arising of duplicate toast" })
    const thirdCheckbox = page.getByRole('checkbox', { name: "Show toast with icon" })
    const checkboxes = page.getByRole('checkbox')

    await expect(firstCheckbox).toBeChecked()
    await expect(secondCheckbox).not.toBeChecked()
    await expect(thirdCheckbox).toBeChecked()

    await secondCheckbox.click({ force: true })

    for (const box of await checkboxes.all()) {
        await expect(box).toBeChecked()
    }

    for (const box of await checkboxes.all()) {
        await box.uncheck({ force: true })
        await box.isChecked()
        expect(await box.isChecked()).toBeFalsy()
    }
})

test('lists and dropdown', async ({ page }) => {
    const colorChangeDropdownButton = page.locator('ngx-header nb-select')
    await colorChangeDropdownButton.click()
    const listOption = page.getByRole('list').locator('nb-option')
    await expect(listOption).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await listOption.filter({ hasText: "Cosmic" }).click()

    const headerLocator = page.locator('nb-layout-header')
    await expect(headerLocator).toHaveCSS("background-color", "rgb(50, 50, 89)")
    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    await colorChangeDropdownButton.click()
    for (const [color, rgb] of Object.entries(colors)) {
        await listOption.filter({ hasText: color }).click()
        await expect(headerLocator).toHaveCSS('background-color', rgb)
        if (color !== "Corporate") {
            await colorChangeDropdownButton.click()
        }
    }
})

test('tooltip', async ({ page }) => {
    await page.getByText("Modal & Overlays").click()
    await page.getByText("Tooltip").click()

    const tooltipCard = page.locator('nb-card', { hasText: "Tooltip Placement" })
    await tooltipCard.getByRole('button', { name: "Top" }).hover()

    const tooltipText = await page.locator('nb-tooltip').textContent()

    expect(tooltipText).toEqual("This is a tooltip")
})

test('smart table', async ({ page }) => {

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    });
    await page.getByText("Tables & Data").click()
    await page.getByText("Smart Table").click()

    await page.locator('table').locator('tr', { hasText: "mdo@gmail.com" }).locator(".nb-trash").click()
    const allText = await page.locator('table tbody tr').first().locator('td').nth(5).textContent()
    expect(allText).not.toEqual("mdo@gmail.com")
})

test('web table', async ({ page }) => {
    await page.getByText("Tables & Data").click()
    await page.getByText("Smart Table").click()

    var userRow = await getRowByColumnValue(page, ' E-mail ', 'twitter@outlook.com')
    var editButton = await getEditButtonByRow(userRow)
    await editButton.click()
    var editField = await getCellByRowAndColumnNameInEditMode(page, ' Age ')
    await editField.fill("55")
    var saveButton = await getSaveButtonByRow(page)
    await saveButton.click()

    const cell = await getCellByRowAndColumnName(page, ' Age ', userRow)
    const newAgeValue = await cell.textContent()
    expect(newAgeValue).toEqual('55')
})

test('edit email for user by Id', async ({ page }) => {
    await page.getByText("Tables & Data").click()
    await page.getByText("Smart Table").click()
    const newEmail = 'newEmail@wer.com'
    const row = await getRowById(page, "44")
    var editButton = await getEditButtonByRow(row)
    await editButton.click()
    var editField = await getCellByRowAndColumnNameInEditMode(page, ' E-mail ')
    await editField.fill(newEmail)
    var saveButton = await getSaveButtonByRow(page)
    await saveButton.click()

    const cell = await getCellByRowAndColumnName(page, ' E-mail ', row)
    const newAgeValue = await cell.textContent()
    expect(newAgeValue).toEqual(newEmail)
})

test.skip('filter of the table', async ({ page }) => {
    test.setTimeout(80_000) // 60 секунд
    await page.getByText("Tables & Data").click()
    await page.getByText("Smart Table").click()

    const columnName = ' Age '
    for (let i = 10; i < 100; i++) {
        const filterCell = await getFilterCellByColumnName(page, columnName)
        await filterCell.clear()
        await filterCell.fill(i.toString())
        await page.waitForTimeout(500)
        const values = await getValuesByColomn(page, columnName)
        const valuesLangth = values.length
        if (valuesLangth === 0) {
            console.log(`There is no one with age ${i}`);
        } else {
            console.log(`There is ${valuesLangth} with age ${i}`);
        }

        for (let y = 0; y < valuesLangth; y++) {
            expect(values[y]).toEqual(i.toString())

        }
    }
})

test.skip('date picker', async ({ page }) => {
    test.setTimeout(80_000)
    await page.getByText("Forms").click()
    await page.getByText("Datepicker").click()
    const dateField = page.getByPlaceholder('Form Picker')
    const date = new Date()
    date.setDate(date.getDate() - 1110)
    const day = date.getDate().toString()
    const year = date.getFullYear()
    const shortMonth = date.toLocaleString('En-US', { month: 'short' })
    await selectDate(page, date)
    await page.waitForTimeout(500)
    await expect(dateField).toHaveValue(`${shortMonth} ${day}, ${year}`)
})

test('slider', async ({ page }) => {
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    const box = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempGauge.evaluate(node => {
        node.setAttribute('cx', '133.0')
        node.setAttribute('cy', '10.0')
    })
    await tempGauge.click()

    await expect(box).toContainText('21')

    await box.scrollIntoViewIfNeeded()

    const rect = await box.boundingBox()
    if (!rect) {
        throw new Error('Bounding box not found')
    }
    const x = rect.x + rect.width / 2
    const y = rect.y + rect.height / 2
    await page.mouse.move(x, y)
    await page.mouse.down()
    await page.mouse.move(x + 100, y)
    await page.mouse.move(x + 100, y + 100)
    await page.mouse.up()
    await expect(box).toContainText('30')
})

test('drag and drop with iframe', async ({ page, globalQaURL }) => {
    await page.goto(globalQaURL)
    const iframe = page.frameLocator('[rel-title="Photo Manager"] iframe')
    await iframe.locator('li', { hasText: "High Tatras 2" }).dragTo(iframe.locator('#trash'))

    await iframe.locator('li', { hasText: "High Tatras 4" }).hover()
    await page.mouse.down()
    await iframe.locator('#trash').hover()
    await page.mouse.up()

    await expect(iframe.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"])
})

async function selectDate(page: Page, date: Date) {
    const dateField = page.getByPlaceholder('Form Picker')
    await dateField.click()
    const previousButton = page.locator('nb-card .prev-month')
    const nextButton = page.locator('nb-card .next-month')

    while (true) {
        const actualDate = await getDateFromPage(page)
        const expectedValue = date.getFullYear() * 12 + date.getMonth()
        const actualValue = actualDate.getFullYear() * 12 + actualDate.getMonth()
        if (expectedValue === actualValue) {
            break
        }
        if (actualValue > expectedValue) {
            await page.waitForTimeout(500)
            await previousButton.click()
        } else {
            await page.waitForTimeout(500)
            await nextButton.click()
        }
    }
    await page.waitForTimeout(500)
    console.log(date.getDate().toString());

    await page.locator('.day-cell.ng-star-inserted:not(.bounding-month)').getByText(date.getDate().toString(), { exact: true }).click()
}

async function getDateFromPage(page: Page): Promise<Date> {
    const date = await page.locator('nb-card button').first().textContent()
    return new Date(`${date} 1`)
}

async function getIndexOfColumnByName(page: Page, columnName: string): Promise<number> {
    const columnsLocator = page.locator('table tr').first().locator('th')
    await columnsLocator.last().waitFor()
    const columnsNams = await columnsLocator.allTextContents()
    return columnsNams.indexOf(columnName)
}

async function getRowByColumnValue(page: Page, columnName: string, value: string): Promise<Locator> {
    const columnIndex = await getIndexOfColumnByName(page, columnName)
    const row = page.locator('table tbody tr').filter({
        has: page.locator('td').nth(columnIndex).filter({
            hasText: value
        })
    })

    return row
}

async function getCellByRowAndColumnName(page: Page, columnName: string, row: Locator): Promise<Locator> {
    const columnIndex = await getIndexOfColumnByName(page, columnName)
    return row.locator('td').nth(columnIndex)
}

async function getFilterCellByColumnName(page: Page, columnName: string) {
    const columnIndex = await getIndexOfColumnByName(page, columnName)
    const row = page.locator('table thead tr').last()
    return row.locator('input').nth(columnIndex - 1)
}

async function getCellByRowAndColumnNameInEditMode(page: Page, columnName: string): Promise<Locator> {
    const columnIndex = await getIndexOfColumnByName(page, columnName)
    return page.locator('table tbody tr')
        .filter({
            has: page.locator('.nb-checkmark')
        })
        .locator('td').nth(columnIndex).locator('input')

}

async function getEditButtonByRow(row: Locator): Promise<Locator> {
    return row.locator('.nb-edit')
}

async function getSaveButtonByRow(page: Page): Promise<Locator> {
    return page.locator('table tbody tr').locator('.nb-checkmark')
}

async function getNaxtPageButton(page: Page): Promise<Locator> {
    return page.locator('[aria-label="Next"]')
}

async function getRowById(page: Page, id: string): Promise<Locator> {
    while (true) {
        const values = await getValuesByColomn(page, ' ID ')

        const isIdPresent = values.includes(id)
        if (isIdPresent) {
            return getRowByColumnValue(page, ' ID ', id)
        }

        const nextButton = await getNaxtPageButton(page)
        if (await nextButton.isDisabled()) {
            throw new Error(`Row with id ${id} was not found`)
        }

        await nextButton.click()
    }
}

async function getValuesByColomn(page: Page, colomnName: string): Promise<String[]> {
    const columnIndex = await getIndexOfColumnByName(page, colomnName)
    const values: string[] = []
    const rows = page.locator('table tbody tr')
    const rowsCount = await rows.count()
    const firstRowText = await rows.first().textContent()
    if (firstRowText === ' No data found ') {
        return values
    }
    for (let index = 0; index < rowsCount; index++) {
        const value = await rows.nth(index).locator('td').nth(columnIndex).textContent()
        values.push(value!)
    }
    return values
}


