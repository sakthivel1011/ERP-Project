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
import { useForm, useFieldArray, Controller } from "react-hook-form"; // form for add new customer
// import { Data } from "../../../Data/Data";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"; //popup msg and action button ku
import "./Customer.scss";
import CustomTextField from "../../../Components/CustomField";
import CustomButton from "../../../Components/CustomButton";

import ContactsIcon from "@mui/icons-material/Contacts";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
// import { customerService } from "../../../Services/customer";

import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { fetchAllUsers } from "../../../Redux/userSlice"; //get data from redux

function Customer() {
  //fetch Api from redux

  const dispatch = useAppDispatch();

  const {
    list: liveData,
    loading,
    error,
  } = useAppSelector((state) => state.users);

  useEffect(() => {
    const promise = dispatch(fetchAllUsers());
    return () => {
      promise.abort();
    };
  }, []);

  //popup state
  const [open, setOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupData, setPopupData] = useState(null);

  //KPI card
  const kpicard = useMemo(() => {
    const rawdata = liveData?.customers || [];
    const total = rawdata.length;
    const invoicedata = liveData?.invoices || [];

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
  }, [liveData]);

  // Filter Fields
  const [statusfilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  ///form creation for add customer
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customerCode: "",
      companyName: "",
      gstNumber: "",
      panNumber: "",
      customerType: "Corporate",
      creditLimit: 0,
      paymentTerms: "30 Days",
      currency: "INR",
      contacts: [{ name: "", designation: "", email: "", mobile: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contacts",
  });

  const onFormSubmit = (formData) => {
    console.log("getvalue", getValues());
    console.log("New Customer Added Sucessfully:", formData);
    handleClose(); // Save panna pin popup close aagum
  };

  const FilterTable = useMemo(() => {
    // 1. Core data arrays properties fetch components lookups
    let filtered = liveData?.customers || [];
    const invoice = liveData?.invoices || [];

    // Filter Step A: Status Dropdown select check logic (Handles "all" value smoothly)
    if (statusfilter && statusfilter !== "all") {
      const matchingcustomer = invoice
        .filter(
          (inv) => inv.status?.toLowerCase() === statusfilter.toLowerCase(),
        )
        .map((inv) => inv.customerId);

      filtered = filtered.filter((c) =>
        matchingcustomer.includes(c.customerId),
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (c) =>
          c.customerCode?.toLowerCase().includes(query) ||
          c.companyName?.toLowerCase().includes(query) ||
          c.customerType?.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [statusfilter, searchQuery, liveData]);

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
    reset();
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
        header: "Status",
        id: "status",
        size: 50,
        Cell: ({ row }) => {
          const currentCustomerId = row.original.customerId;
          // console.log("currentCustomerId", liveData);
          const matchingInvoice = liveData?.invoices?.find(
            (inv) => inv.customerId === currentCustomerId,
          );
          return <span>{matchingInvoice?.status || "-"}</span>;
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
              <CustomButton
                className="contact"
                variant="contained"
                size="small"
                color="primary"
                sx={{ paddingY: "4px", minHeight: "unset", height: "25px" }}
                startIcon={<ContactsIcon />}
                onClick={() =>
                  handleActionClick("Contact Details", customer.contacts)
                }
              >
                Contact
              </CustomButton>
              <CustomButton
                className="Billing"
                variant="contained"
                size="small"
                color="secondary"
                sx={{ paddingY: "4px", minHeight: "unset", height: "25px" }}
                startIcon={<ReceiptLongIcon />}
                onClick={() =>
                  handleActionClick("Billing Address", customer.billingAddress)
                }
              >
                Billing
              </CustomButton>
              <CustomButton
                className="Shipping"
                variant="contained"
                size="small"
                color="success"
                sx={{ paddingY: "4px", minHeight: "unset", height: "25px" }}
                startIcon={<LocalShippingIcon />}
                onClick={() =>
                  handleActionClick(
                    "Shipping Address",
                    customer.shippingAddress,
                  )
                }
              >
                Shipping
              </CustomButton>
            </Stack>
          );
        },
      },
    ],
    [liveData],
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
    state: { isLoading: loading },

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
    if (popupTitle === "Add New Customer") {
      return (
        <form id="add-customer-form" onSubmit={handleSubmit(onFormSubmit)}>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid xs={12} sm={6}>
              <Controller
                name="customerCode"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label="Customer Code"
                    size="small"
                    width="200px"
                    error={!!errors.customerCode}
                    helperText={errors.customerCode?.message}
                  />
                )}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <Controller
                name="companyName"
                control={control}
                rules={{ required: "Required" }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label="Company Name"
                    size="small"
                    fullWidth
                    error={!!errors.companyName}
                    helperText={errors.companyName?.message}
                  />
                )}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <Controller
                name="gstNumber"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label="GST Number"
                    size="small"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <Controller
                name="panNumber"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label="PAN Number"
                    size="small"
                    fullWidth
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 1 }}>
              Contacts List
            </Typography>
            {fields.map((item, index) => (
              <Box
                key={item.id}
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
                  justifyContent="space-between"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="body2">
                    Contact Person {index + 1}
                  </Typography>
                  {fields.length > 1 && (
                    <CustomButton
                      color="error"
                      size="small"
                      style={{ marginLeft: "auto" }}
                      onClick={() => remove(index)}
                    >
                      Remove
                    </CustomButton>
                  )}
                </Stack>
                <Grid container spacing={2}>
                  <Grid xs={12} sm={6}>
                    <Controller
                      name={`contacts.${index}.name`}
                      control={control}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          label="Name"
                          size="small"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`contacts.${index}.designation`}
                      control={control}
                      render={({ field: desigField }) => (
                        <CustomTextField
                          {...desigField}
                          label="Designation"
                          size="small"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name={`contacts.${index}.email`}
                      control={control}
                      render={({ field: emailField }) => (
                        <CustomTextField
                          {...emailField}
                          type="email"
                          label="Email"
                          size="small"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={12} sm={6}>
                    <Controller
                      name={`contacts.${index}.mobile`}
                      control={control}
                      render={({ field }) => (
                        <CustomTextField
                          {...field}
                          label="Mobile"
                          size="small"
                          fullWidth
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
            <CustomButton
              variant="outlined"
              size="small"
              onClick={() =>
                append({ name: "", designation: "", email: "", mobile: "" })
              }
            >
              + Add Contact
            </CustomButton>
          </Box>
        </form>
      );
    }

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
      <Typography className="heading">Customer Management</Typography>

      {/*KPI cards*/}
      <Grid container spacing={2} className="kpi-container" sx={{ mb: 3 }}>
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          width: "100%",
        }}
      >
        {/* Search bar */}
        <CustomTextField
          variant="outlined"
          placeholder="Search Code, Company Name..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="Searchbar"
          width="250px"
          height="32px"
        />

        {/* Filter Status */}
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <CustomTextField
            select
            variant="outlined"
            label="Filter Status"
            // size="small"
            height="32px"
            value={statusfilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filterstatus"
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
          </CustomTextField>
          {/*Add new customer*/}
          <CustomButton
            variant="contained"
            size="small"
            className="Add-customer"
            onClick={() => handleActionClick("Add New Customer", null)}
          >
            Add Customer
          </CustomButton>
        </Stack>
      </Box>

      <Box className="table-wrapper">
        <MaterialReactTable table={table} />
      </Box>

      {/*//popup display and popup data show*/}
      {/*//final ah popup la antha data show agum step5*/}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={popupTitle === "Add New Customer" ? "md" : "xs"}
      >
        <DialogTitle className="dialog-title">{popupTitle}</DialogTitle>
        <DialogContent dividers className="dialog-content">
          {renderPopupcontent()}
        </DialogContent>
        <DialogActions
          className="dialog-actions"
          sx={{ p: 2, gap: 0, justifyContent: "flex-end" }}
        >
          <CustomButton
            onClick={handleClose}
            variant="outlined"
            color="inherit"
          >
            Close
          </CustomButton>
          <DialogActions className="dialog-actions">
            {popupTitle === "Add New Customer" && (
              <CustomButton
                form="add-customer-form"
                type="submit"
                variant="contained"
                color="primary"
              >
                Save Customer
              </CustomButton>
            )}
          </DialogActions>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
export default Customer;
