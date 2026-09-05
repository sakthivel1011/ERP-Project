import { expect } from '@playwright/test';

export class InvoicePage {
  constructor(page) {
    this.page = page;
    
   this.salesMenuButton = page.locator('text=Sales').first(); // Adjust selector if your sidebar uses icons/different text
    this.pageHeader = page.locator('h5:has-text("Invoice Management"), h1:has-text("Invoice Management")').first();
    this.searchInput = page.locator('input[placeholder="Search Invoice..."]');
    this.filterDropdown = page.locator('label:has-text("Filter Status"), .Dropdown').first();
    this.addInvoiceButton = page.locator('button:has-text("Add Invoice")');

      this.invoiceForm = page.locator('#add-invoice-form');
    this.invoiceNumberInput = page.locator('input[name="invoiceNumber"]');
    this.addItem = page.locator('button:has-text("+ Add Item")');
    this.productRowHeader = page.locator('text=Product Row #2').first();
    
   
  }
   async navigateToInvoicePage() {
    await this.salesMenuButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.salesMenuButton.click();
    await this.page.waitForTimeout(1000); 

    const invoiceSubMenu = this.page.locator('text=Invoice').first();
    await invoiceSubMenu.waitFor({ state: 'visible', timeout: 5000 });
    await invoiceSubMenu.click();
    await this.page.waitForTimeout(1000); 
  }

  async verifyPageLoaded() {
    await this.pageHeader.waitFor({ state: 'visible', timeout: 8000 });
    await expect(this.pageHeader).toBeVisible();
  }

  async searchInvoice(text) {
    await this.searchInput.waitFor({ state: 'visible' });
    await this.searchInput.click();
    await this.searchInput.fill(text);
    await this.page.waitForTimeout(500); 
  }


   async filterByStatus(statusName) {
    await this.filterDropdown.waitFor({ state: 'visible' });
    await this.filterDropdown.click();
    await this.page.waitForTimeout(500); 
  

    const option = this.page.locator(`li[role="option"]:has-text("${statusName}")`).first();
    await option.waitFor({ state: 'visible', timeout: 3000 });
    await option.click();
    await this.page.waitForTimeout(500); 
  }
    async openAddInvoiceModal() {
    await this.addInvoiceButton.waitFor({ state: 'visible', timeout: 5000 });
    await this.addInvoiceButton.click();
    
    // Wait for the popup content form to be visible on screen
    await this.invoiceForm.waitFor({ state: 'visible', timeout: 5000 });
    await expect(this.invoiceForm).toBeVisible();
  }

  async fillInvoiceNumber(invNum) {
    await this.invoiceNumberInput.waitFor({ state: 'visible' });
    await this.invoiceNumberInput.fill(invNum);
  }

    

 async clickAddItemInsideModal() {
    await this.addItem.waitFor({ state: 'visible', timeout: 5000 });
    await this.addItem.click();
    
    // Verifies that clicking "+ Add Item" successfully added a second product form row segment
    await this.productRowHeader.waitFor({ state: 'visible', timeout: 5000 });
    await expect(this.productRowHeader).toBeVisible();
  }
}
