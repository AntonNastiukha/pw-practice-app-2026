import { Page } from "@playwright/test";
import { HalperBase } from "./halperBase";

export class NavigationPage extends HalperBase {
    
    constructor(page: Page) {
        super(page)
    }

    async formsLayoutsPage() {
        this.expandGroupMenuByTitle('Forms')
        await this.page.getByText('Form Layouts').click()
    }

    async datepickerPage() {
        this.expandGroupMenuByTitle('Forms')
        await this.page.getByText('Datepicker').click()
    }

    async smartTablePage() {
        this.expandGroupMenuByTitle('Tables & Data')
        await this.page.getByText('Smart Table').click()
    }

    async toasterPage() {
        this.expandGroupMenuByTitle('Modal & Overlays')
        await this.page.getByText('Toastr').click()
    }

    async tooltipPage() {
        this.expandGroupMenuByTitle('Modal & Overlays')
        await this.page.getByText('Tooltip').click()
    }

    private async expandGroupMenuByTitle(title: string) {
        const groupMenu = this.page.getByTitle(title)
        const isGroupMenuExpanded = await groupMenu.getAttribute('aria-expanded')
        if (isGroupMenuExpanded == "false") {
            await groupMenu.click()
        }
    }
}