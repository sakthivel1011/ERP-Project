import { test } from '@playwright/test';
import { InvoicePage } from './pages/InvoicePage.js';

test('E2E Test: Navigate to Invoice, Verify Table UI, Global Search, and Filter', async ({ page }) => {
  const invoicePage = new InvoicePage(page);

  await page.goto('http://localhost:5173/ERP-Project/');

  await invoicePage.navigateToInvoicePage();
await invoicePage.verifyPageLoaded();
  await invoicePage.searchInvoice('INV');
  await invoicePage.filterByStatus('Unpaid');
  await invoicePage.openAddInvoiceModal();
  await invoicePage.fillInvoiceNumber('INV-2026-999');
  await invoicePage.clickAddItemInsideModal();
  await page.waitForTimeout(3000);
});
