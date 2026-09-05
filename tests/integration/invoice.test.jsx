import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Invoice from '../../src/Pages/Sales/invoice/Invoice.jsx';


vi.mock('../../src/Data/Data', () => ({
  Data: {
    invoices: [
      { invoiceNumber: 'INV-ERP-101', customerId: 'CUST-99', grandTotal: 5000, status: 'Unpaid' }
    ],
    customers: [
      { customerId: 'CUST-99', companyName: 'Tamil Corp', paymentTerms: '30 Days' }
    ]
  }
}));

describe('Integration Test: Invoice Page UI', () => {
  it('should render invoice table headers and mocked rows correctly', async () => {
    render(<Invoice />);


    expect(screen.getByText('Invoice No')).toBeInTheDocument();
    expect(screen.getByText('Company Name')).toBeInTheDocument();

   
    expect(screen.getByText('INV-ERP-101')).toBeInTheDocument();
    expect(screen.getByText('Tamil Corp')).toBeInTheDocument();
  });
});
