import { Page } from "@playwright/test";
import { HalperBase } from "./halperBase";

export class FormLayoutsPage extends HalperBase{

    constructor(page: Page) {
        super(page)
    }

    async fillInAllFieldsAndSubmitUsingTheGridForm(email: string, password: string, optionName: string) {
        const frame = this.page.locator('nb-card', { hasText: 'Using the Grid' })
        const emailField = frame.getByRole('textbox', { name: "Email" })
        const passwordField = frame.getByRole('textbox', { name: "Password" })
        const option = frame.getByRole('radio', { name: optionName })
        const signButton = frame.getByRole('button')

        await emailField.fill(email)
        await passwordField.fill(password)
        await option.check({ force: true })
        await signButton.click()
    }

    async fillInAllFieldsAndSubmitInlineForm(name: string, email: string, isRememberMe: boolean) {
        const frame = this.page.locator('nb-card', { hasText: 'Inline form' })
        const nameField = frame.getByRole('textbox', { name: "Jane Doe" })
        const emailField = frame.getByRole('textbox', { name: "Email" })
        const checkbox = frame.getByRole('checkbox')
        const submitButton = frame.getByRole('button')

        await nameField.fill(name)
        await emailField.fill(email)
        if (isRememberMe) {
            await checkbox.check({ force: true })
        }
        await submitButton.click()
    }
}