import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Data } from "../../../Data/Data";
import { Grid, Box, Typography, Stack } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Paper,
  InputBase,
  IconButton,
} from "@mui/material";
import "../invoice/invoice.scss";

// 📦 React Hook Form packages for standard JavaScript state handling
import { useForm, useFieldArray, Controller } from "react-hook-form";

export default function Invoice() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [statusfilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");


  // ⚡ Master useForm configuration with standard default layouts properties matching ungal matrix keys
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      invoiceNumber: "",
      customerId: "",
      invoiceDate: "",
      paymentTerms: "30 Days",
      status: "Unpaid",
      // Multiple items deep nested object templates schema tracking array
      items: [
        { description: "", itemCode: "", qty: 1, rate: 0, discount: 0, gst: 0 },
      ],
      // Multiple payments nested array list templates schemas tracking tracking references
      payments: [
        {
          paymentId: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
          amountPaid: 0,
          paymentDate: "",
          paymentMode: "Bank Transfer",
        },
      ],
    },
  });

  // Dynamic loops tracking hooks parameters mapping inputs variables live
  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: "items",
  });

  const {
    fields: paymentFields,
    append: appendPayment,
    remove: removePayment,
  } = useFieldArray({
    control,
    name: "payments",
  });

  const invoiceData = Data?.invoices;

  const handleDropDownChange = (event) => {
    setStatusFilter(event.target.value);
  };
  const filterStatusData = useMemo(() => {
    const rawInvoices = Array.isArray(invoiceData) ? invoiceData : [];
    const customerList = Data?.customers || [];

    const formatted = rawInvoices.map((invoice) => {
      const matchedCustomer = customerList.find(
        (cust) => cust.customerId === invoice?.customerId,
      );

      return {
        rawInvoice: invoice,
        invoiceNumber:
          invoice?.quotationNumber || invoice?.invoiceNumber || "-",
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
  }, [invoiceData, statusfilter, searchQuery, Data?.customers]);

  const handleActionClick = (type, rowData) => {
    setModalOpen(true);
    setModalType(type);
    setSelectedInvoice(rowData);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedInvoice(null);
    reset(); // Core form cleanup function triggered smoothly on exit
  };

  const onFormSubmit = (formData) => {
    console.log(
      "SUCCESS! React Hook Form - Invoice Payload Object Data:",
      formData,
    );
    alert("Invoice Form Saved Successfully! No: " + formData.invoiceNumber);
    handleCloseModal();
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
              className="Items"
              onClick={() => handleActionClick("items", row.original)}
            >
              Items
            </Button>
            <Button
              className="Payment"
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
    enableGlobalFilter: false,
    enableTopToolbar: false,
    enableFilters: false,
    enablePagination: true,
    enableHiding: false,
    enableColumnActions: false,
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    paginationDisplayMode: "pages",
    layoutMode: "semantic",
    initialState: {
      density: "compact",
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    muiTableHeadCellProps: { className: "tableheader" },
    muiTableProps: { className: "mrt-gapped-table" },
    muiTableBodyRowProps: { className: "tablebody" },
    muiTableContainerProps: { className: "scroll" },
    muiTablePaperProps: { className: "custom table" },
  });
  const renderPopupcontent = () => {
    if (modalType === "addInvoice") {
      return (
        <form id="add-invoice-form" onSubmit={handleSubmit(onFormSubmit)}>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="invoiceNumber"
                control={control}
                rules={{ required: "Invoice Number required" }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Invoice Number"
                    size="small"
                    fullWidth
                    error={!!errors.invoiceNumber}
                    helperText={errors.invoiceNumber?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Select Company Customer"
                size="small"
                fullWidth
                {...control.register("customerId", { required: true })}
              >
                {(Data?.customers || []).map((c) => (
                  <MenuItem key={c.customerId} value={c.customerId}>
                    {c.companyName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="invoiceDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    label="Invoice Date"
                    size="small"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Payment Terms"
                size="small"
                fullWidth
                {...control.register("paymentTerms")}
              >
                <MenuItem value="15 Days">15 Days</MenuItem>
                <MenuItem value="30 Days">30 Days</MenuItem>
                <MenuItem value="45 Days">45 Days</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {/* Core Invoice Products Items Dynamic List Loop Segment */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              Invoice Items List
            </Typography>
            {itemFields.map((field, index) => (
              <Box
                key={field.id}
                sx={{
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                  mb: 2,
                  bgcolor: "#fafafa",
                }}
              >
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Product Row #{index + 1}
                  </Typography>
                  {itemFields.length > 1 && (
                    <Button
                      color="error"
                      size="small"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </Button>
                  )}
                </Stack>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`items.${index}.description`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field: d }) => (
                        <TextField
                          {...d}
                          label="Description Name"
                          size="small"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`items.${index}.itemCode`}
                      control={control}
                      render={({ field: c }) => (
                        <TextField
                          {...c}
                          label="Item Code"
                          size="small"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name={`items.${index}.qty`}
                      control={control}
                      render={({ field: q }) => (
                        <TextField
                          {...q}
                          type="number"
                          label="Qty"
                          size="small"
                          fullWidth
                          onChange={(e) => q.onChange(Number(e.target.value))}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller
                      name={`items.${index}.rate`}
                      control={control}
                      render={({ field: r }) => (
                        <TextField
                          {...r}
                          type="number"
                          label="Rate Price"
                          size="small"
                          fullWidth
                          onChange={(e) => r.onChange(Number(e.target.value))}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Controller
                      name={`items.${index}.discount`}
                      control={control}
                      render={({ field: ds }) => (
                        <TextField
                          {...ds}
                          type="number"
                          label="Disc %"
                          size="small"
                          fullWidth
                          onChange={(e) => ds.onChange(Number(e.target.value))}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Controller
                      name={`items.${index}.gst`}
                      control={control}
                      render={({ field: g }) => (
                        <TextField
                          {...g}
                          type="number"
                          label="GST %"
                          size="small"
                          fullWidth
                          onChange={(e) => g.onChange(Number(e.target.value))}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button
              variant="outlined"
              size="small"
              sx={{ textTransform: "none" }}
              onClick={() =>
                appendItem({
                  description: "",
                  itemCode: "",
                  qty: 1,
                  rate: 0,
                  discount: 0,
                  gst: 0,
                })
              }
            >
              + Add Item
            </Button>
          </Box>
        </form>
      );
    }

    if (!selectedInvoice) return null;

    // 💡 B) Items Details Viewing Block Setup
    if (modalType === "items") {
      return (
        <Box>
          {selectedInvoice.rawInvoice?.items &&
          selectedInvoice.rawInvoice?.items?.length > 0 ? (
            selectedInvoice.rawInvoice?.items?.map((item, index) => (
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
                    Line Amount: ₹{item.amount?.toLocaleString("en-IN") || 0}
                  </Typography>
                </Stack>
              </Box>
            ))
          ) : (
            <Typography color="text.secondary">
              No items found for this Invoice.
            </Typography>
          )}
        </Box>
      );
    }

    //  C) Payments Ledger Viewing Block Setup
    if (modalType === "payments") {
      return (
        <Box>
          {selectedInvoice.rawInvoice?.payments &&
          selectedInvoice.rawInvoice?.payments?.length > 0 ? (
            selectedInvoice.rawInvoice?.payments?.map((payment, index) => (
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
                <Typography
                  variant="subtitle2"
                  color="green"
                  sx={{ fontWeight: "bold" }}
                >
                  Payment Receipt #{index + 1}
                </Typography>
                <Stack spacing={0.5} sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Payment Id:</strong> {payment.paymentId || "-"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Date:</strong> {payment.date || "-"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Mode:</strong> {payment.mode || "-"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Reference:</strong> {payment.reference || "-"}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{ mt: 0.5, fontWeight: "bold", color: "green" }}
                  >
                    Amount Credited: ₹
                    {payment.amount?.toLocaleString("en-IN") || 0}
                  </Typography>
                </Stack>
              </Box>
            ))
          ) : (
            <Box
              sx={{
                p: 2,
                bgcolor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" color="error.main">
                No transactions recorded. This invoice remains completely
                unpaid.
              </Typography>
            </Box>
          )}
          <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #e0e0e0" }}>
            <Typography variant="body2">
              Current Standing Status: <strong>{selectedInvoice.status}</strong>
            </Typography>
          </Box>
        </Box>
      );
    }
    return null;
  };
  return (
    <Box className="Table">
      <Typography className="invoiceName">Invoice Management</Typography>

      {/* KPI Display Metrics Panels Blocks */}
      <Grid container spacing={2} className="kpi-container" sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <Box className="kpi-total">
            <Typography className="status">Total Invoices</Typography>
            <Typography>{kpiData.totalInvoices}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box className="kpi-paid">
            <Typography className="status">Paid Amount</Typography>
            <Typography>{kpiData.paidCount}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box className="kpi-unpaid">
            <Typography className="status">Unpaid Amount</Typography>
            <Typography>{kpiData.unPaidCount}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box className="kpi-over">
            <Typography className="status">Over Due</Typography>
            <Typography>{kpiData.overDueCount}</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Action Controllers and Filter Status Dropdowns */}
      <Box className="NewInv">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
            width: "100%",
          }}
        >
          <Paper
            className="search"
            variant="outlined"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: 250,
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Invoice"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <IconButton sx={{ p: "6px", color: "#6b6375" }}></IconButton>
          </Paper>

          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <TextField
              select
              variant="outlined"
              label="Filter Status"
              size="small"
              value={statusfilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="Dropdown"
              sx={{ minWidth: "140px" }}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="unpaid">UnPaid</MenuItem>
              <MenuItem value="overdue">Overdue</MenuItem>
              <MenuItem value="partially Paid">Partially Paid</MenuItem>
            </TextField>

            <Button
              variant="contained"
              onClick={() => handleActionClick("addInvoice", null)}
            >
              Add Invoice
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Main Datagrid Core View Table Wrapper */}
      <Box className="table-wrapper">
        <MaterialReactTable table={table} />
      </Box>

      {/* Shared Popup Window Dialog Layout Component */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        slots={{ backdrop: () => null }}
        fullWidth
        maxWidth={modalType === "addInvoice" ? "md" : "xs"} // Form expanding size adjustment parameters live
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {modalType === "addInvoice" && "Add New Invoice"}
          {modalType === "items" && "Invoice Item Details"}
          {modalType === "payments" && "Payment Ledger"}
        </DialogTitle>

        <DialogContent dividers>{renderPopupcontent()}</DialogContent>

        <DialogActions sx={{ p: 2, gap: 1.5 }}>
          <Button onClick={handleCloseModal} variant="outlined" color="inherit">
            Close
          </Button>
          {/* Linked Form Save Trigger button mapped safely utilizing form structural identification keys */}
          {modalType === "addInvoice" && (
            <Button
              form="add-invoice-form"
              type="submit"
              variant="contained"
              color="primary"
            >
              Save Invoice
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
