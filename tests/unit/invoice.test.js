import { describe, it, expect } from 'vitest';
import { calculateKpis, filterAndFormatInvoices } from '../../src/Pages/Sales/invoice/InvoiceUtils.jsx'

describe('Unit Test: Invoice Utility Logic', () => {
  
  // 1. KPI கணக்கீடுகள் சரியாக வேலை செய்கிறதா என சோதித்தல்
  describe('calculateKpis', () => {
    it('should correctly count paid, unpaid, and overdue invoices', () => {
      const mockInvoices = [
        { status: 'Paid' },
        { status: 'unpaid' },
        { status: 'Paid' },
        { status: 'Overdue' }
      ];

      const result = calculateKpis(mockInvoices);

      expect(result.totalInvoices).toBe(4);
      expect(result.paidCount).toBe(2);
      expect(result.unPaidCount).toBe(1);
      expect(result.overDueCount).toBe(1);
    });

    it('should handle empty invoice lists safely', () => {
      const result = calculateKpis([]);
      expect(result.totalInvoices).toBe(0);
      expect(result.paidCount).toBe(0);
    });
  });

  // 2. ஃபில்டரிங் மற்றும் சர்ச் சரியாக வேலை செய்கிறதா என சோதித்தல்
  describe('filterAndFormatInvoices', () => {
    const mockInvoices = [
      { invoiceNumber: 'INV-001', customerId: 'CUST-1', status: 'Paid', grandTotal: 500 },
      { invoiceNumber: 'INV-002', customerId: 'CUST-2', status: 'Unpaid', grandTotal: 1000 }
    ];

    const mockCustomers = [
      { customerId: 'CUST-1', companyName: 'Google', paymentTerms: '15 Days' },
      { customerId: 'CUST-2', companyName: 'Amazon', paymentTerms: '30 Days' }
    ];

    it('should match invoices with correct customer details', () => {
      const result = filterAndFormatInvoices(mockInvoices, mockCustomers, 'all', '');
      
      expect(result).toHaveLength(2);
      expect(result[0].companyName).toBe('Google');
      expect(result[0].paymentTerms).toBe('15 Days');
    });

    it('should filter by status correctly', () => {
      const result = filterAndFormatInvoices(mockInvoices, mockCustomers, 'unpaid', '');
      
      expect(result).toHaveLength(1);
      expect(result[0].invoiceNumber).toBe('INV-002');
    });

    it('should filter by search query correctly', () => {
      const result = filterAndFormatInvoices(mockInvoices, mockCustomers, 'all', 'Amazon');
      
      expect(result).toHaveLength(1);
      expect(result[0].invoiceNumber).toBe('INV-002');
    });
  });
});
