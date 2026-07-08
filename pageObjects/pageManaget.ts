import { Page } from "@playwright/test";
import { NavigationPage } from '../pageObjects/pageObject'
import { FormLayoutsPage } from "../pageObjects/formLayoutsPage"
import { DatePickerPage } from "../pageObjects/datePickerPage"

export class PageManager{
    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly formLayoutsPage: FormLayoutsPage
    private readonly datePickeerPage: DatePickerPage

    constructor(page: Page) {
        this.page = page
        this.navigationPage = new NavigationPage(page)
        this.formLayoutsPage = new FormLayoutsPage(page)
        this.datePickeerPage = new DatePickerPage(page)
    }

    navigateTo() {
        return this.navigationPage
    }

    onFormLayoutsPage() {
        return this.formLayoutsPage
    }

    onDatePickerPage() {
        return this.datePickeerPage
    }
}