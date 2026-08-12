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

export default function Quotations () {
  console.log('123456789p')
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [statusfilter, setStatusFilter] = useState("all");

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
       Quotation Management
      </Typography>

      <Grid container spacing={10}>
        <Grid  xs={12} sm={3}>
          <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
            <Typography color="text.secondary">Total Quotation </Typography>
            <Typography variant="h6">{kpiData.totalQuotation}</Typography>
          </Box>
        </Grid>
        <Grid xs={12} sm={3}>
          <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
            <Typography color="text.secondary">Converted</Typography>
            <Typography variant="h6">{kpiData.convertedCount}</Typography>
          </Box>
        </Grid>
        <Grid  xs={12} sm={3}>
          <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
            <Typography color="text.secondary">Sent</Typography>
            <Typography variant="h6">{kpiData.sentCount}</Typography>
          </Box>
        </Grid>
        <Grid   xs={12} sm={3}>
          <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
            <Typography color="text.secondary">Draft</Typography>
            <Typography variant="h6">{kpiData.draftCount}</Typography>
          </Box>
        </Grid>

        <Grid   xs={12} sm={3}>
          <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
            <Typography color="text.secondary">Expired</Typography>
            <Typography variant="h6">{kpiData.expiredCount}</Typography>
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
          <MenuItem value="converted">Converted</MenuItem>
          <MenuItem value="sent">Sent</MenuItem>
          <MenuItem value="draft">Draft</MenuItem>
          <MenuItem value="expired">Expired</MenuItem>
        </TextField>
      </Box>

      <MaterialReactTable table={table} />

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        slots={{ backdrop: () => null }}
       
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {modalType === "items" ? "Quotation Item Details" : "Item Ledger"}
        </DialogTitle>

        <DialogContent dividers>
          {selectedQuotation ? (
            <Box>
              {modalType === "items" && (
                <Box>
                  {selectedQuotation.rawQuotation?.items &&
                  selectedQuotation.rawQuotation?.items?.length > 0 ? (
                    selectedQuotation.rawQuotation?.items?.map((items, index) => (
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
                          {items.description || "Product Item"}
                        </Typography>
                        <Stack spacing={0.5} sx={{ mt: 1 }}>
                          <Typography variant="body2">
                            <strong>Item Code:</strong> {items.itemCode || "-"}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Quantity:</strong> {items.qty || 0}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Rate:</strong> ₹{items.rate || 0}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Discount:</strong> {items.discount || 0}%
                          </Typography>
                          <Typography variant="body2">
                            <strong>GST:</strong> {items.gst || 0}%
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ mt: 1, fontWeight: "bold" }}
                          >
                            Line Amount: ₹
                            {items.amount?.toLocaleString("en-IN") || 0}
                          </Typography>
                        </Stack>
                      </Box>
                    ))
                  ) : (
                    <Typography color="text.secondary">
                      No items found for this Quotation.
                    </Typography>
                  )}
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
