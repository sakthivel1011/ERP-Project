import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Data } from "../../Data/Data";
import { Grid, Box, Typography, Stack } from "@mui/material";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";

export default function Invoice() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [statusfilter, setStatusFilter] = useState("all");
  console.log("selectedInvoice", selectedInvoice);

  const invoiceData = Data?.invoices;

  const handleDropDownChange = (event) => {
    setStatusFilter(event.target.value);
  };

  

const filterStatusData = useMemo(() => {
  const rawInvoices = Array.isArray(invoiceData) ? invoiceData : [];
  const customerList = Data?.customers || [];

  const formatted = rawInvoices.map((invoice) => {
    const matchedCustomer = customerList.find(
      (cust) => cust.customerId === invoice?.customerId
    );

    return {
      rawInvoice: invoice, 
      invoiceNumber: invoice?.quotationNumber || invoice?.invoiceNumber || "-", 
      companyName: matchedCustomer ? matchedCustomer.companyName : "-", 
      invoiceDate: invoice?.quotationDate || invoice?.invoiceDate || "-",
      paymentTerms: matchedCustomer?.paymentTerms || "-", 
      amount: invoice?.grandTotal || invoice?.subtotal || 0, 
      status: invoice?.status || "-",
    };
  });

 
  if (statusfilter?.toLowerCase() === "all" || !statusfilter) {
    return formatted;
  }
  
  return formatted.filter(
    (invoice) => invoice?.status?.toLowerCase() === statusfilter?.toLowerCase()
  );

}, [invoiceData, statusfilter, Data?.customers])



  const handleActionClick = (type, rowData) => {
    setModalOpen(true);
    setModalType(type);
    setSelectedInvoice(rowData);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedInvoice(null);
  };

  const kpiData = useMemo(() => {
    const invoiceList = Data?.invoices || [];
    const totalInvoices = invoiceList.length;
    const paidCount = invoiceList.filter(
      (inv) => inv.status?.toLowerCase() === "paid",
    ).length;
    const unPaidCount = invoiceList.filter(
      (inv) => inv.status?.toLowerCase() === "unpaid",
    ).length;
    const overDueCount = invoiceList.filter(
      (inv) => inv.status?.toLowerCase() === "overdue",
    ).length;
    return {
      totalInvoices,
      paidCount,
      unPaidCount,
      overDueCount,
    };
  }, [Data?.invoices]);

  console.log(statusfilter);

  const columns = useMemo(
    () => [
      { accessorKey: "invoiceNumber", header: "Invoice No" },
      { accessorKey: "companyName", header: "Company Name" },
      { accessorKey: "invoiceDate", header: "Invoice Date" },
      { accessorKey: "paymentTerms", header: "Payment Terms" },
      { accessorKey: "amount", header: "Amount" },
      { accessorKey: "status", header: "Status" },
      {
        accessorKey: "actions",
        header: "Action",
        enableSorting: false,
        Cell: ({ row }) => (
          <Stack direction="row" spacing={2} sx={{ width: "200px" }}>
            <Button
              variant="contained"
              size="small"
              onClick={() => handleActionClick("items", row.original)}
            >
              Items
            </Button>
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={() => handleActionClick("payments", row.original)}
            >
              Payments
            </Button>
          </Stack>
        ),
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: filterStatusData,
    // data:tableData,
    enablePagination: true,
    enableHiding: false,
    enableColumnActions: false,
  });

  return (
    <Box
      sx={{
        width: "calc(100% - 270px)",
        marginLeft: "250px",
        marginRight: "20px",
        boxSizing: "border-box",
        minHeight: "100vh",
        pt: 3,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 4,
          fontWeight: "bold",
          color: "black",
        }}
      >
        Invoice Management
      </Typography>

      <Grid container spacing={10}>
        <Grid  xs={12} sm={3}>
          <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
            <Typography color="text.secondary">Total Invoices</Typography>
            <Typography variant="h6">{kpiData.totalInvoices}</Typography>
          </Box>
        </Grid>
        <Grid  xs={12} sm={3}>
          <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
            <Typography color="text.secondary">Paid Amount</Typography>
            <Typography variant="h6">{kpiData.paidCount}</Typography>
          </Box>
        </Grid>
        <Grid  xs={12} sm={3}>
          <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
            <Typography color="text.secondary">Unpaid Amount</Typography>
            <Typography variant="h6">{kpiData.unPaidCount}</Typography>
          </Box>
        </Grid>
        <Grid  xs={12} sm={3}>
          <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
            <Typography color="text.secondary">Over Due</Typography>
            <Typography variant="h6">{kpiData.overDueCount}</Typography>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
        <TextField
          select
          variant="outlined"
          defaultValue={""}
          label="Filter Status"
          size="small"
          value={statusfilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: "250px", bgcolor: "white" }}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="paid">Paid</MenuItem>
          <MenuItem value="unpaid">UnPaid</MenuItem>
          <MenuItem value="overdue">Overdue</MenuItem>
          <MenuItem value="partially Paid">Patially Paid</MenuItem>
        </TextField>
      </Box>

      <MaterialReactTable table={table} />

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        slots={{ backdrop: () => null }}
       
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {modalType === "items" ? "Invoice Item Details" : "Payment Ledger"}
        </DialogTitle>

        <DialogContent dividers>
          {selectedInvoice ? (
            <Box>
              {modalType === "items" && (
                <Box>
                  {selectedInvoice.rawInvoice?.items &&
                  selectedInvoice.rawInvoice.items.length > 0 ? (
                    selectedInvoice.rawInvoice.items.map((item, index) => (
                      <Box
                        key={index}
                        sx={{
                          mb: 2,
                          p: 2,
                          bgcolor: "#f9f9f9",
                          border: "1px solid #e5e7eb",
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold", color: "primary.main" }}
                        >
                          {item.description || "Product Item"}
                        </Typography>
                        <Stack spacing={0.5} sx={{ mt: 1 }}>
                          <Typography variant="body2">
                            <strong>Item Code:</strong> {item.itemCode || "-"}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Quantity:</strong> {item.qty || 0}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Rate:</strong> ₹{item.rate || 0}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Discount:</strong> {item.discount || 0}%
                          </Typography>
                          <Typography variant="body2">
                            <strong>GST:</strong> {item.gst || 0}%
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ mt: 1, fontWeight: "bold" }}
                          >
                            Line Amount: ₹
                            {item.amount?.toLocaleString("en-IN") || 0}
                          </Typography>
                        </Stack>
                      </Box>
                    ))
                  ) : (
                    <Typography color="text.secondary">
                      No items found for this invoice.
                    </Typography>
                  )}
                </Box>
              )}

              {modalType === "payments" && (
                <Box>
                  {selectedInvoice.rawInvoice?.payments &&
                  selectedInvoice.rawInvoice.payments.length > 0 ? (
                    selectedInvoice.rawInvoice.payments.map(
                      (payment, index) => (
                        <Box
                          key={index}
                          sx={{
                            mb: 2,
                            p: 2,
                            bgcolor: "#f0fdf4",
                            border: "1px solid #bbf7d0",
                            borderRadius: 1,
                          }}
                        >
                          <Stack spacing={0.5}>
                            <Typography variant="body2">
                              <strong>Payment Id:</strong>{" "}
                              {payment.paymentId || "-"}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Date:</strong> {payment.date || "-"}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Mode:</strong> {payment.mode || "-"}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Reference:</strong>{" "}
                              {payment.reference || "-"}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                mt: 0.5,
                                fontWeight: "bold",
                                color: "green",
                              }}
                            >
                              Amount Credited: ₹
                              {payment.amount?.toLocaleString("en-IN") || 0}
                            </Typography>
                          </Stack>
                        </Box>
                      ),
                    )
                  ) : (
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: "#fef2f2",
                        border: "1px solid #fecaca",
                        borderRadius: 1,
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="error.main"
                        sx={{ fontStyle: "italic" }}
                      >
                        No transactions recorded. This invoice remains
                        completely unpaid.
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #e0e0e0" }}>
                    <Typography variant="body2">
                      Current Standing Status:{" "}
                      <strong>{selectedInvoice.status}</strong>
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          ) : (
            <Typography>No active data loaded.</Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseModal} variant="contained" fullWidth>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}