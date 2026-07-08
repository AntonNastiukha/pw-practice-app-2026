import { test as base } from '@playwright/test'
import { PageManager } from "../pw-practice-app/pageObjects/pageManaget"

export type TestOptions = {
    globalQaURL: string,
    mainPage: string,
    pageManager: PageManager
}

export const test = base.extend<TestOptions>({
    globalQaURL: [
        '', { option: true }
    ],
    mainPage: async ({ page }, use) => {
        page.goto('/')
        await use('')
    },
    pageManager: async ({ page, mainPage }, use) => {
        const pm = new PageManager(page)
        await use(pm)
    },
})