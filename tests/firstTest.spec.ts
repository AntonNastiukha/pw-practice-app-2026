import { test } from "@playwright/test"

test.beforeEach(async ({ page }) => {
    await page.goto("/")
})

test.describe("forms", () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText("Forms").click()
    })

    test("navigate to form leyouts page", async ({ page }) => {
        await page.getByText("Form Layouts").click()
    })

    test("navigate to datepicker page", async ({ page }) => {
        await page.getByText("Datepicker").click()
    })
})

test.describe("charts", () => {
    test.beforeEach(async ({ page }) => {
        await page.getByText("Charts").first().click()
    })

    test("navigate to charts page", async ({ page }) => {
        await page.getByText("Echarts").click()
    })
})

test('test var let', async ({ page }) => {
    for (var i = 0; i < 3; i++) {
        let j = i
        setTimeout(() => console.log(j), 0)
    }

     for (let y = 0; y < 3; y++) {
        setTimeout(() => console.log(y), 0)
    }

})

