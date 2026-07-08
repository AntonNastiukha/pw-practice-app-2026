import { Page, expect } from "@playwright/test";
import { HalperBase } from "./halperBase";

export class DatePickerPage extends HalperBase {

    constructor(page: Page) {
        super(page)
    }

    async selectDateAndVereify(date: Date) {

        const day = date.getDate().toString()
        const year = date.getFullYear()
        const shortMonth = date.toLocaleString('En-US', { month: 'short' })
        const dateField = this.page.getByPlaceholder('Form Picker')
        await this.selectDate(date)

        await expect(dateField).toHaveValue(`${shortMonth} ${day}, ${year}`)
    }

    async selectDatesAndVereify(startDate: Date, endDate: Date) {

        const startDay = startDate.getDate().toString()
        const startYear = startDate.getFullYear()
        const startShortMonth = startDate.toLocaleString('En-US', { month: 'short' })
        const endDay = endDate.getDate().toString()
        const endYear = endDate.getFullYear()
        const endShortMonth = endDate.toLocaleString('En-US', { month: 'short' })
        const dateField = this.page.getByPlaceholder('Range Picker')
        await this.selectDate(startDate)
        await this.selectDate(endDate)

        await expect(dateField)
            .toHaveValue(`${startShortMonth} ${startDay}, ${startYear} - ${endShortMonth} ${endDay}, ${endYear}`)
    }

    async openFormPicker() {
        await this.page.getByPlaceholder('Form Picker').click()
    }

    async openDatePickerWithRange() {
        await this.page.getByPlaceholder('Range Picker').click()
    }

    private async getDateFromPage(): Promise<Date> {
        const date = await this.page.locator('nb-card button').first().textContent()
        return new Date(`${date} 1`)
    }

    private async selectDate(date: Date) {
        const previousButton = this.page.locator('nb-card .prev-month')
        const nextButton = this.page.locator('nb-card .next-month')

        while (true) {
            const actualDate = await this.getDateFromPage()
            const expectedValue = date.getFullYear() * 12 + date.getMonth()
            const actualValue = actualDate.getFullYear() * 12 + actualDate.getMonth()
            if (expectedValue === actualValue) {
                break
            }
            if (actualValue > expectedValue) {
                await this.waitForNumberOfSeconds(5)
                await previousButton.click()
            } else {
                await this.waitForNumberOfSeconds(5)
                await nextButton.click()
            }
        }
        await this.waitForNumberOfSeconds(5)
        console.log(date.getDate().toString());

        await this.page.locator('.day-cell.ng-star-inserted:not(.bounding-month)').getByText(date.getDate().toString(), { exact: true }).click()
    }
}