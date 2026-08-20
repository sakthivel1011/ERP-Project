import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { Data } from "../../../Data/Data";
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
import "./Quotation.scss";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

export default function Quotations () {
  console.log('123456789p')
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [statusfilter, setStatusFilter] = useState("all");

  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      quotationNumber: "",
      customerId: "",
      quotationDate: "",
      expiryDate: "",
      status: "Draft",
      items: [{ description: "", itemCode: "", qty: 1, rate: 0, discount: 0, gst: 0 }] 
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const quotationData = Data?.quotations;

  const handleDropDownChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const filterStatusData = useMemo(()=>{
    const rawQuotation = Array.isArray(quotationData) ? quotationData : [];
    const customerList = Data?.customers || [];

    const formatted = rawQuotation.map((quotation)=>{
      const matchedCustomer = customerList.find(
        (cust) => cust.customerId === quotation?.customerId
      );

      return {
        rawQuotation: quotation, 
        quotationNumber: quotation?.quotationNumber || "-", 
        companyName: matchedCustomer ? matchedCustomer.companyName : "-", 
        quotationDate: quotation?.quotationDate ||  "-",
        amount: quotation?.subtotal || 0, 
        expiryDate:quotation?.expiryDate || "-",
        status: quotation?.status || "-",
      };
    });
    
    if (statusfilter?.toLowerCase() === "all" || !statusfilter) {
      return formatted;
    }

    return formatted.filter(
      (quotation) => quotation?.status?.toLowerCase() === statusfilter?.toLowerCase()
    );

  },[quotationData, statusfilter, Data?.customers])

  const handleActionClick = (type, rowData) => {
    setModalOpen(true);
    setModalType(type);
    setSelectedQuotation(rowData);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedQuotation(null);
    reset(); 
  };

  const onFormSubmit = (formData) => {
    console.log("🔥 SUCCESS! React Hook Form Data Ready:", formData);
    alert("Saved Successfully! Quotation: " + formData.quotationNumber);
    handleCloseModal();
  };
  const kpiData = useMemo(() => {
    const quotationList = Data?.quotations|| [];
    const totalQuotation = quotationList.length;
    const convertedCount = quotationList.filter(
      (quo) => quo.status?.toLowerCase() === "converted",
    ).length;
    const sentCount = quotationList.filter(
      (quo) => quo.status?.toLowerCase() === "sent",
    ).length;
    const draftCount = quotationList.filter(
      (quo) => quo.status?.toLowerCase() === "draft",
    ).length;
    const expiredCount = quotationList.filter(
      (quo) => quo.status?.toLowerCase() === "expired",
    ).length;
    return {
      totalQuotation,
      convertedCount,
      sentCount,
      draftCount,
      expiredCount,
      status,
    };
  }, [Data?.quotations]);

  const columns = useMemo(
    () => [
      { accessorKey: "quotationNumber", header: "Quotation No" },
      { accessorKey: "companyName", header: "Company Name" },
      { accessorKey: "quotationDate", header: "Quotation Date" },
      { accessorKey: "expiryDate", header: "Expire Date" },
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
              onClick={(e) => {
                e.stopPropagation();
                handleActionClick("items", row.original)
              }}
            >
              Items
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
    enablePagination: true,
    enableHiding: false,
    enableColumnActions: false,
    enableGlobalFilter:false,
    enableTopToolbar:false,
    enableFilters:false,
  });

  const renderPopupcontent = () => {
    if (modalType === "addQuotation") {
      return (
        <form id="add-quotation-form" onSubmit={handleSubmit(onFormSubmit)}>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            {/* Quotation Number Field */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="quotationNumber"
                control={control}
                rules={{ required: "Quotation Number is required" }}
                render={({ field }) => (
                  <TextField {...field} label="Quotation Number" size="small" fullWidth error={!!errors.quotationNumber} helperText={errors.quotationNumber?.message} />
                )}
              />
            </Grid>
            {/* Select Customer Dropdown */}
            <Grid item xs={12} sm={6}>
              <TextField select label="Select Customer" size="small" fullWidth {...control.register("customerId", { required: true })}>
                {(Data?.customers || []).map((cust) => (
                  <MenuItem key={cust.customerId} value={cust.customerId}>{cust.companyName}</MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* Quotation Date Selection */}
  <LocalizationProvider dateAdapter={AdapterDayjs}>
  <Controller
    name="quotationDate"
    control={control}
    render={({ field }) => (
      <DatePicker
        value={field.value ? dayjs(field.value) : null}
        onChange={(date) =>
          field.onChange(date ? date.format("YYYY-MM-DD") : "")
        }
        label="Quotation Date"
        slotProps={{
          textField: {
            size: "small",
            fullWidth: false,
          },
        }}
      />
    )}
  />
</LocalizationProvider>
            {/* Expiry Date Selection */}
  <LocalizationProvider dateAdapter={AdapterDayjs}>
  <Controller
    name="expireDate"
    control={control}
    render={({ field }) => (
      <DatePicker
        value={field.value ? dayjs(field.value) : null}
        onChange={(date) =>
          field.onChange(date ? date.format("YYYY-MM-DD") : "")
        }
        label="Expire Date"
        slotProps={{
          textField: {
            size: "small",
            fullWidth: false,
          },
        }}
      />
    )}
  />
</LocalizationProvider>
</Grid>
          {/* Dynamic Quotation Items Elements Map Loops */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>Quotation Items List</Typography>
            {fields.map((field, index) => (
              <Box key={field.id} sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, mb: 2, bgcolor: "#fafafa" }}>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Item Row #{index + 1}</Typography>
                  {fields.length > 1 && (
                    <Button 
                     variant="contained" 
                     color="error"      
                     size="small" 
                     onClick={() => remove(index)}
                     sx={{ 
                     textTransform: "uppercase" 
                     }}
                     >
                     REMOVE ITEM
                    </Button>
                  )}
                </Stack>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Controller name={`items.${index}.description`} control={control} rules={{ required: "Description is required" }} render={({ field: descField }) => <TextField {...descField} label="Item Description / Name" size="small" fullWidth />} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller name={`items.${index}.itemCode`} control={control} render={({ field: codeField }) => <TextField {...codeField} label="Item Code" size="small" fullWidth />} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller name={`items.${index}.qty`} control={control} render={({ field: qtyField }) => <TextField {...qtyField} type="number" label="Quantity" size="small" fullWidth onChange={(e) => qtyField.onChange(Number(e.target.value))} />} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Controller name={`items.${index}.rate`} control={control} render={({ field: rateField }) => <TextField {...rateField} type="number" label="Rate (₹)" size="small" fullWidth onChange={(e) => rateField.onChange(Number(e.target.value))} />} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Controller name={`items.${index}.discount`} control={control} render={({ field: discField }) => <TextField {...discField} type="number" label="Discount %" size="small" fullWidth onChange={(e) => discField.onChange(Number(e.target.value))} />} />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Controller name={`items.${index}.gst`} control={control} render={({ field: gstField }) => <TextField {...gstField} type="number" label="GST %" size="small" fullWidth onChange={(e) => gstField.onChange(Number(e.target.value))} />} />
                  </Grid>
                </Grid>
              </Box>
            ))}
            <Button variant="outlined" size="small" sx={{ textTransform: "none" }} onClick={() => append({ description: "", itemCode: "", qty: 1, rate: 0, discount: 0, gst: 0 })}>
              + Add Item Row
            </Button>
          </Box>
        </form>
      );
    }

    // Default existing viewing logic matrix to show items detailed textual rows
    if (!selectedQuotation) return null;
    return (
      <Box>
        {modalType === "items" && (
          <Box>
            {selectedQuotation.rawQuotation?.items &&
            selectedQuotation.rawQuotation?.items?.length > 0 ? (
              selectedQuotation.rawQuotation?.items?.map((items, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, bgcolor: "#f9f9f9", border: "1px solid #e5e7eb", borderRadius: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "primary.main" }}>{items.description || "Product Item"}</Typography>
                  <Stack spacing={0.5} sx={{ mt: 1 }}>
                    <Typography variant="body2"><strong>Item Code:</strong> {items.itemCode || "-"}</Typography>
                    <Typography variant="body2"><strong>Quantity:</strong> {items.qty || 0}</Typography>
                    <Typography variant="body2"><strong>Rate:</strong> ₹{items.rate || 0}</Typography>
                    <Typography variant="body2"><strong>Discount:</strong> {items.discount || 0}%</Typography>
                    <Typography variant="body2"><strong>GST:</strong> {items.gst || 0}%</Typography>
                    <Typography variant="subtitle2" sx={{ mt: 1, fontWeight: "bold" }}>Line Amount: ₹{items.amount?.toLocaleString("en-IN") || 0}</Typography>
                  </Stack>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">No items found for this Quotation.</Typography>
            )}
          </Box>
        )}
      </Box>
    );
  };
  return (
    <Box
      sx={{
        width: "calc(100% - 250px)",
        marginLeft: "220px",
        marginRight: "90px",
        boxSizing: "border-box",
        minHeight: "auto",
        pt: 1, 
      }}
    >
      <Typography variant="h5" className="heading" sx={{ mb: 1, color: "black", textAlign: "left", mt: -1}}>
        Quotation Management
      </Typography>

      <Grid container spacing={2} rowSpacing={1} columnSpacing={3} className = "kpi-container">
        <Grid item xs={12} sm="auto">
          <Box className = "kpi-total" display="flex" flexDirection="column" alignItems="center" textAlign="center">
            <Typography color="text.secondary">Total Quotation</Typography>
            <Typography variant="h6">{kpiData.totalQuotation}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm="auto">
          <Box className = "kpi-convt" display="flex" flexDirection="column" alignItems="center" textAlign="center">
            <Typography color="text.secondary">Converted</Typography>
            <Typography variant="h6">{kpiData.convertedCount}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm="auto">
          <Box className = "kpi-sent" display="flex" flexDirection="column" alignItems="center" textAlign="center">
            <Typography color="text.secondary">Sent</Typography>
            <Typography variant="h6">{kpiData.sentCount}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm="auto">
          <Box className = "kpi-draft" display="flex" flexDirection="column" alignItems="center" textAlign="center">
            <Typography color="text.secondary">Draft</Typography>
            <Typography variant="h6">{kpiData.draftCount}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm="auto">
          <Box className = "kpi-expired" display="flex" flexDirection="column" alignItems="center" textAlign="center">
            <Typography color="text.secondary">Expired</Typography>
            <Typography variant="h6">{kpiData.expiredCount}</Typography>
          </Box>
        </Grid>
      </Grid>

      <Box className="filter"sx={{ display: "flex", justifyContent: "flex-end" ,gap: 2, mt: 0}}>
        <TextField
          select
          variant="outlined"
          label="Filter Status"
          size="small"
          value={statusfilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="dropdown"
          sx={{ minWidth: "140px" }}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="converted">Converted</MenuItem>
          <MenuItem value="sent">Sent</MenuItem>
          <MenuItem value="draft">Draft</MenuItem>
          <MenuItem value="expired">Expired</MenuItem>
        </TextField>
        
        <Button 
          className="custom-blue-button" 
          variant="contained"
          onClick={() => handleActionClick("addQuotation", null)}
        >
          Add Quotation
        </Button>
      </Box>

      <Box className="search">
        <TextField
          className="searchbox"
          variant="outlined"
          placeholder="Search anything..."
          size="small"
          sx={{ width: "250px", bgcolor: "white" }}
        />
      </Box>

      <Box className="table-wrapper" sx={{ mt: 1}}>
        <MaterialReactTable table={table} />
      </Box>

      {/* Shared Popup Window Control Dialog Structure Box */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        slots={{ backdrop: () => null }}
        fullWidth
        maxWidth={modalType === "addQuotation" ? "md" : "xs"} 
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {modalType === "addQuotation" ? "Add New Quotation" : "Quotation Item Details"}
        </DialogTitle>

        <DialogContent dividers>
          {modalType === "addQuotation" ? renderPopupcontent() : (selectedQuotation ? renderPopupcontent() : <Typography>No active data loaded.</Typography>)}
        </DialogContent>

        <DialogActions sx={{ p: 2, display: "flex", gap: 1.5 }}>
          <Button onClick={handleCloseModal} variant="outlined" color="inherit" >
            Cancel
          </Button>
          {modalType === "addQuotation" && (
            <Button form="add-quotation-form" type="submit" variant="contained" color="primary">
              Save Quotation
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}