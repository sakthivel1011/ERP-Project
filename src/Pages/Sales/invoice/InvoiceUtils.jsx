export function calculateKpis(invoices = []) {
  const invoiceList = Array.isArray(invoices) ? invoices : [];
  return {
    totalInvoices: invoiceList.length,
    paidCount: invoiceList.filter((inv) => inv.status?.toLowerCase() === "paid")
      .length,
    unPaidCount: invoiceList.filter(
      (inv) => inv.status?.toLowerCase() === "unpaid",
    ).length,
    overDueCount: invoiceList.filter(
      (inv) => inv.status?.toLowerCase() === "overdue",
    ).length,
    partiallyPaidCount: invoiceList.filter(
      (inv) => inv.status?.toLowerCase() === "partiallypaid",
    ).length,
  };
}

export function filterAndFormatInvoices(
  rawInvoices = [],
  customerList = [],
  statusfilter = "all",
  searchQuery = "",
) {
  const formatted = rawInvoices.map((invoice) => {
    const matchedCustomer = customerList.find(
      (cust) => cust.customerId === invoice?.customerId,
    );
    return {
      invoiceNumber: invoice?.quotationNumber || invoice?.invoiceNumber || "-",
      companyName: matchedCustomer ? matchedCustomer.companyName : "-",
      invoiceDate: invoice?.quotationDate || invoice?.invoiceDate || "-",
      paymentTerms: matchedCustomer?.paymentTerms || "-",
      amount: invoice?.grandTotal || invoice?.subtotal || 0,
      status: invoice?.status || "-",
    };
  });

  let result = formatted;
  if (statusfilter?.toLowerCase() !== "all" && statusfilter) {
    result = result.filter(
      (invoice) =>
        invoice?.status?.toLowerCase() === statusfilter?.toLowerCase(),
    );
  }

  if (searchQuery.trim() !== "") {
    const query = searchQuery.toLowerCase();
    result = result.filter((invoice) => {
      return (
        invoice.invoiceNumber.toLowerCase().includes(query) ||
        invoice.companyName.toLowerCase().includes(query) ||
        invoice.invoiceDate.toLowerCase().includes(query) ||
        invoice.paymentTerms.toLowerCase().includes(query) ||
        invoice.status.toLowerCase().includes(query) ||
        String(invoice.amount).toLowerCase().includes(query)
      );
    });
  }

  return result;
}
