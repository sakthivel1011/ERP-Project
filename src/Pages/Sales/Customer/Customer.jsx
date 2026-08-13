import React, { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Stack,
  Typography,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material"; // Normal table creation
// import { Data } from "../../Data/Data";
import { Data } from "../../../Data/Data";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"; //popup msg and action button ku
import "./Customer.scss";

function Customer() {
  //popup state
  const [open, setOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupData, setPopupData] = useState(null);

  //KPI card
  const kpicard = useMemo(() => {
    const rawdata = Data?.customers || [];
    const total = rawdata.length;
    const invoicedata = Data?.invoices || [];

    const paid = invoicedata.filter(
      (i) => i.status?.toLowerCase() == "paid",
    ).length;
    const unpaid = invoicedata.filter(
      (i) => i.status?.toLowerCase() == "unpaid",
    ).length;
    const overdue = invoicedata.filter(
      (i) => i.status?.toLowerCase() == "overdue",
    ).length;
    const partiallypaid = invoicedata.filter(
      (i) => i.status?.toLowerCase() == "partially paid",
    ).length;
    return { total, paid, unpaid, overdue, partiallypaid };
  });

  // Filter Fields
  const [statusfilter, setStatusFilter] = useState("");

  const FilterTable = useMemo(() => {
    const customer = Data?.customers || [];
    const invoice = Data?.invoices || [];

    if (!statusfilter || statusfilter === "all") return customer;
    // status filter la ethuvum click pann la na all customer nu show agum
    const matchingcustomer = invoice
      .filter(
        (inv) =>
          inv.status?.toLocaleLowerCase() == statusfilter.toLocaleLowerCase(),
      )
      .map((inv) => inv.customerId);
    return customer.filter((c) => matchingcustomer.includes(c.customerId));
  }, [statusfilter]);

  //function handle button click and popup
  const handleActionClick = (title, data) => {
    // user click panra data enga store agum step3
    setPopupTitle(title);
    setPopupData(data);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setPopupData(null);
  };

  //CREATE COLOUMNS NAME FOR TABLE
  const columns = useMemo(
    () => [
      //   {
      //     accessorKey: "customerId", //DATA TABLE LA ERUKA COLUMN NAME
      //     header: "Customer ID", //UI LA SHOW AGURA COLOUMN NAME
      //     size: 100,
      //   },
      {
        accessorKey: "customerCode",
        header: "Customer Code",
        size: 50,
      },
      {
        accessorKey: "companyName",
        header: "Company Name",
        size: 50,
      },
      {
        accessorKey: "gstNumber",
        header: "GST Number",
        size: 50,
      },
      {
        accessorKey: "customerType",
        header: "Type",
        size: 50,
      },
      {
        accessorKey: "paymentTerms",
        header: "Payments Terms",
        size: 50,
      },
      // Status Table la show aga
      {
        id: "invoiceStatus",
        header: "Status",
        size: 50,
        Cell: ({ row }) => {
          const currentCustomerId = row.original.customerId;
          const matchingInvoice = Data?.invoices?.find(
            (inv) => inv.customerId === currentCustomerId,
          );
          const statusValue = matchingInvoice?.status || "-";
          return <span>{statusValue}</span>;
        },
      },
      {
        accessorKey: "creditLimit",
        header: "Credit Limit",
        size: 50,
        Cell: ({ cell, row }) => {
          const amount = cell.getValue();
          const currency = row.original.currency || "INR";
          return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: currency,
            maximumFractionDigits: 0,
          }).format(amount);
        },
      },

      // Add new coloumn Action And button
      {
        accessorKey: "action",
        header: "Actions",
        size: 50,
        Cell: ({ row }) => {
          const customer = row.original; //row.original nu kudutha  antha row la eruka compltet data vum vanthurum step1
          return (
            <Stack direction="row" spacing={1}>
              {/* //user click panra button vanthu handleaction (title and data) top l declare panni eruka handle action click ku pogum step2*/}
              <Button
                className="contact"
                variant="contained"
                size="small"
                color="primary"
                onClick={() =>
                  handleActionClick("Contact Details", customer.contacts)
                }
              >
                Contact
              </Button>
              <Button
                className="Billing"
                variant="contained"
                size="small"
                color="secondary"
                onClick={() =>
                  handleActionClick("Billing Address", customer.billingAddress)
                }
              >
                Billing
              </Button>
              <Button
                className="Shipping"
                variant="contained"
                size="small"
                color="success"
                onClick={() =>
                  handleActionClick(
                    "Shipping Address",
                    customer.shippingAddress,
                  )
                }
              >
                Shipping
              </Button>
            </Stack>
          );
        },
      },
    ],
    [],
  );

  // TABLE INITIAL INITIALIZATION SETUP AND INSERT DATA INTO TABLE
  const table = useMaterialReactTable({
    columns,
    data: FilterTable || [],
    // enableGlobalFilter: true,
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
      density: "compact", // Gaps reduction parameters setup
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      }, // 5 records per page pota height
    },

    muiTableHeadCellProps: {
      className: "tableheader",
    },
    muiTableProps: {
      className: "mrt-gapped-table", // Main table wrapper for the spacing
    },
    muiTableBodyRowProps: {
      className: "tablebody",
    },
    muiTableContainerProps: {
      className: "scroll",
    },
    muiTablePaperProps: {
      className: "custom table",
    },
  });

  // popup data show panna
  const renderPopupcontent = () => {
    //check data contact or  address ah step4
    if (!popupData) return null;
    if (Array.isArray(popupData)) {
      //Contact data va popup la show panna
      return popupData.map((contact, index) => (
        <Box key={index}>
          <Typography>
            <strong>Name:</strong>
            {contact.name}
          </Typography>
          <Typography>
            <strong>Designation:</strong>
            {contact.designation}
          </Typography>
          <Typography>
            <strong>Email:</strong>
            {contact.email}
          </Typography>
          <Typography>
            <strong>Mobile:</strong>
            {contact.mobile}
          </Typography>
        </Box>
      ));
    }
    // pop up data for address
    return (
      <Box>
        <Typography>
          <strong>Address:</strong> {popupData.address1}
        </Typography>
        <Typography>
          <strong>City:</strong> {popupData.city}
        </Typography>
        <Typography>
          <strong>State:</strong> {popupData.state}
        </Typography>
        <Typography>
          <strong>Country:</strong> {popupData.country}
        </Typography>
        <Typography>
          <strong>Pincode:</strong> {popupData.pincode}
        </Typography>
      </Box>
    );
  };

  return (
    <Box className="TableBox">
      <Typography
        variant="h5"
        sx={{ mb: 1, fontWeight: "bold", textAlign: "left" }}
      >
        Customer Management
      </Typography>

      {/*KPI cards*/}
      <Grid container spacing={6} sx={{ mb: 3 }}>
        {/* Total Customer*/}
        <Grid xs={12} sm={3}>
          <Box className="total">
            <Typography>Total Customers</Typography>
            <Typography>{kpicard.total}</Typography>
          </Box>
        </Grid>

        <Grid xs={12} sm={3}>
          <Box className="paid">
            <Typography>Paid</Typography>
            <Typography>{kpicard.paid}</Typography>
          </Box>
        </Grid>

        <Grid xs={12} sm={3}>
          <Box className="unpaid">
            <Typography>Unpaid</Typography>
            <Typography>{kpicard.unpaid}</Typography>
          </Box>
        </Grid>

        <Grid xs={12} sm={3}>
          <Box className="overdue">
            <Typography>Overdue</Typography>
            <Typography>{kpicard.overdue}</Typography>
          </Box>
        </Grid>
        <Grid xs={12} sm={3}>
          <Box className="partially paid">
            <Typography>Partiallypaid</Typography>
            <Typography>{kpicard.partiallypaid}</Typography>
          </Box>
        </Grid>
      </Grid>

      {/*Filter Data*/}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
        <TextField
          select
          variant="outlined"
          defaultValue={""}
          label="Filter Status"
          size="small"
          value={statusfilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{
            width: "200px",
            bgcolor: "white",
            "& .MuiInputBase-root": {
              height: 32, // Set custom total height
            },
            // Targets the actual input text area
            "& .MuiInputBase-input": {
              padding: "0 10px",
              fontSize: "0.85rem",
            },
          }}
        >
          <MenuItem sx={{ fontSize: "15px" }} value="all">
            All Status
          </MenuItem>
          <MenuItem sx={{ fontSize: "15px" }} value="paid">
            Paid
          </MenuItem>
          <MenuItem sx={{ fontSize: "15px" }} value="unpaid">
            UnPaid
          </MenuItem>
          <MenuItem sx={{ fontSize: "15px" }} value="overdue">
            Overdue
          </MenuItem>
          <MenuItem sx={{ fontSize: "15px" }} value="partially Paid">
            Patially Paid
          </MenuItem>
        </TextField>
        <Button>Add a New Customer</Button>
      </Box>

      <Box className="table-wrapper">
        <MaterialReactTable table={table} />
      </Box>

      {/*//popup display and popup data show*/}
      {/*//final ah popup la antha data show agum step5*/}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle className="dialog-title">{popupTitle}</DialogTitle>
        <DialogContent dividers className="dialog-content">
          {renderPopupcontent()}
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handleClose} variant="outlined" color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
export default Customer;
