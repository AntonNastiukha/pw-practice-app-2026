import { test } from "../test-options"
import { faker } from '@faker-js/faker'

test('fill in Inline form', async ({ pageManager }) => {
    const fullName = faker.person.fullName()
    const email = `${fullName.split(" ").join("")}${faker.number.int(100)}@gmail.com`
    await pageManager.navigateTo().formsLayoutsPage()
    await pageManager.onFormLayoutsPage()
        .fillInAllFieldsAndSubmitInlineForm(fullName, email, true)
})  