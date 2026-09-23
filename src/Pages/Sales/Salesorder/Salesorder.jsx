import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import "./Salesorder.scss";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { salesOrderSchema } from "../../../Validation/SalesOrderSchema";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"; //popup msg and action button ku

import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { fetchAllUsers } from "../../../Redux/userSlice"; // get data from redux

import CustomTextField from "../../../Components/CustomField";
import CustomButton from "../../../components/CustomButton";

//================//
 // redux API Data
//================//
function Salesorder() {
 
  const dispatch = useAppDispatch();

  const {
    list: liveData, //
    loading,
    error,
  } = useAppSelector((state) => state.users);

  useEffect(() => {
    const promise = dispatch(fetchAllUsers());
    return () => {
      promise.abort();
    };
  }, [dispatch]);

//==============//
  //popup state
//==============//
  const [open, setOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupData, setPopupData] = useState(null);


  //============//
  //KPI card
  //============//
  const kpicard = useMemo(() => {
    const rawdata = liveData?.salesOrders || [];
    const total = rawdata.length;
    //   const invoicedata = liveData?.invoices || [];

    const Delivered = rawdata.filter(
      (r) => r.status?.toLowerCase() == "delivered",
    ).length;
    const PartiallyDelivered = rawdata.filter(
      (r) => r.status?.toLowerCase() == "partially delivered",
    ).length;
    const InProduction = rawdata.filter(
      (r) => r.status?.toLowerCase() == "in production",
    ).length;
    const Confirmed = rawdata.filter(
      (i) => i.status?.toLowerCase() == "confirmed",
    ).length;
    return { total, Delivered, PartiallyDelivered, InProduction, Confirmed };
  }, [liveData]);

  // Filter Fields
  const [statusfilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm({resolver: yupResolver(salesOrderSchema), 
    defaultValues: {
      customerId: "",
      salesOrderNumber: "",
      customerPoNumber: "",
      salesOrderDate: new Date().toISOString().split("T")[0],
      customerPoDate: "",
      expectedDeliveryDate: "",
      items: [{ itemDescription: "", qty: "", rate: "", discount: 0, gst: 18 }],
      subtotal: 0,
      gstAmount: 0,
      grandTotal: 0,
      remarks: "",
    },
  });

  const {
    fields: itemFields,
    append: appendItem,
    remove: removeItem,
  } = useFieldArray({
    control,
    name: "items",
  });

  const onFormSubmit = (formData) => {
    console.log("Form Raw Values Trace:", getValues());
    console.log("New Sales Order Added Sucessfully:", formData);
    handleClose();
  };

  const FilterTable = useMemo(() => {
    //Live data show in table customer company name and  Salesorder Data
    if (!liveData) return [];

    const customers = liveData.customers || [];
    const salesOrder = liveData.salesOrders || [];

    // 1. Data Mapping
    let mappedOrders = salesOrder.map((order) => {
      const matchedCustomer = customers.find(
        (cust) => cust.customerId === order.customerId,
      );

      return {
        ...order,
        companyName: matchedCustomer
          ? matchedCustomer.companyName
          : order.customerId,
      };
    });

    // 2. Dropdown Filter Logic
    if (statusfilter && statusfilter !== "all") {
      mappedOrders = mappedOrders.filter(
        (order) => order.status?.toLowerCase() === statusfilter.toLowerCase(),
      );
    }

    // 3. Search Box Logic
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      mappedOrders = mappedOrders.filter((s) => {
        // Numbers aah irundhalum String ah mathi search pannuvom
        const orderNum = s.salesOrderNumber
          ? String(s.salesOrderNumber).toLowerCase()
          : "";
        const poNum = s.customerPoNumber
          ? String(s.customerPoNumber).toLowerCase()
          : "";
        const compName = s.companyName
          ? String(s.companyName).toLowerCase()
          : "";
        const statusText = s.status ? String(s.status).toLowerCase() : "";

        return (
          orderNum.includes(query) ||
          poNum.includes(query) ||
          compName.includes(query) ||
          statusText.includes(query)
        );
      });
    }

    return mappedOrders;
  }, [liveData, searchQuery, statusfilter]);


//===================================//
  // function handle button click and popup//
//===================================//
  const handleActionClick = (title, data) => {
    setPopupTitle(title);
    setPopupData(data);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPopupData(null);
    reset();
  };
//=================================//
//Form Add and  Items,Billing and Shipping Pop up value Showing Place based on condtion//
//=================================//
  const renderPopupcontent = () => {
    if (popupTitle === "Create New Sales Order") {
      return (
        <form
          id="add-salesorder-form"
          onSubmit={handleSubmit(onFormSubmit)}
          noValidate
        >
          <Grid container spacing={2.5} rowSpacing={4.5} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <Controller
                name="customerId"
                control={control}
              
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label="Select Company Name"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.customerId}
                    helperText={errors.customerId?.message}
                    SelectProps={{
                      MenuProps: {
                        disablePortal: true,
                      },
                    }}
                  >
                    <MenuItem value="" disabled>
                      Select Company Name
                    </MenuItem>
                    {(liveData?.customers || []).map((cust) => (
                      <MenuItem key={cust.customerId} value={cust.customerId}>
                        {cust.companyName}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="salesOrderNumber"
                control={control}
                
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Sales Order Number"
                    placeholder="e.g. SO-2026-0003"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.salesOrderNumber}
                    helperText={errors.salesOrderNumber?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="customerPoNumber"
                control={control}
                
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Customer PO Number"
                    placeholder="e.g. PO-VSK-2026-0003"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.customerPoNumber}
                    helperText={errors.customerPoNumber?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="salesOrderDate"
                control={control}
              
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Sales Order Date"
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    error={!!errors.salesOrderDate}
                    helperText={errors.salesOrderDate?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="customerPoDate"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Customer PO Date"
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <Controller
                name="expectedDeliveryDate"
                control={control}
            
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type="date"
                    label="Expected Delivery Date"
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    // error={!!errors.expectedDeliveryDate}
                    // helperText={errors.expectedDeliveryDate?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", mt: 1, mb: 1, color: "primary.main" }}
                
              >
                Product Items Details List
              </Typography>

              {itemFields.map((itemField, index) => (
                <Box
                  key={itemField.id}
                  sx={{
                    p: 2.5,
                    border: "1px dashed #ccc",
                    borderRadius: 1,
                    mb: 2,
                    bgcolor: "#fafafa",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1.5 }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "bold", color: "text.secondary" }}
                    >
                      Product Item #{index + 1}
                    </Typography>
                    {itemFields.length > 1 && (
                      <CustomButton
                        color="error"
                        size="small"
                         className="overallbtn"
                        sx={{
                          height: "24px",
                          minWidth: "unset",
                          paddingX: "10px",
                          marginLeft: "auto",
                        }}
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </CustomButton>
                    )}
                  </Stack>

                      <Grid container spacing={2} rowSpacing={4.5}>
                    <Grid item xs={12} sm={6}>
                      <Controller
                        name={`items.${index}.itemDescription`}
                        control={control}
                      
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label="Item Description"
                            placeholder="e.g. Aluminum Fin Tube"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors?.items?.[index]?.itemDescription}
                            helperText={
                              errors?.items?.[index]?.itemDescription?.message
                            }
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Controller
                        name={`items.${index}.qty`}
                        control={control}
                        
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            type="number"
                            label="Quantity (qty)"
                            placeholder="0"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors?.items?.[index]?.qty}
                            helperText={errors?.items?.[index]?.qty?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Controller
                        name={`items.${index}.rate`}
                        control={control}
                      
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            type="number"
                            label="Rate"
                            placeholder="0.00"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors?.items?.[index]?.rate}
                            helperText={errors?.items?.[index]?.rate?.message}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Controller
                        name={`items.${index}.discount`}
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            type="number"
                            label="Discount (%)"
                            placeholder="0"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Controller
                        name={`items.${index}.gst`}
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            type="number"
                            label="GST (%)"
                            placeholder="0"
                            size="small"
                            InputLabelProps={{ shrink: true }}
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
                sx={{ height: "30px", fontWeight: "bold" }}
                className="overallbtn"
                onClick={() =>
                  appendItem({
                    itemDescription: "",
                    qty: "",
                    rate: "",
                    discount: 0,
                    gst: 18,
                  })
                }
              >
                Add Product Item
              </CustomButton>
            </Grid>
          </Grid>
        </form>
      );
    }

    if (!popupData) return null;

    if (popupTitle === "Items Details" && Array.isArray(popupData)) {
      return popupData.map((item, index) => {
        const itemCode = item.itemCode || "N/A";
        const description = item.description || "N/A";
        const qty = item.qty || 0;
        const rate = item.rate || 0;
        const discount = item.discount || 0;
        const gst = item.gst || 0;
        const amount = item.amount || 0;
        const deliveredQty = item.deliveredQty ?? 0;
        const pendingQty = item.pendingQty ?? 0;
        const itemId = item.salesOrderItemId || "N/A";

        return (
          <Box
            key={index}
            sx={{
              mb: 3,
              pb: 2.5,
              borderBottom:
                index < popupData.length - 1 ? "2px dashed #cccccc" : "none",
            }}
          >
            <Typography
              sx={{
                fontWeight: "bold",
                color: "#1976d2",
                mb: 2,
                fontSize: "16px",
              }}
            >
              Item {index + 1}: {description}
            </Typography>

            <Stack direction="column" spacing={1.5} sx={{ pl: 1 }}>
              <Typography variant="body2">
                <strong>Item Code:</strong> {itemCode}
              </Typography>

              <Typography variant="body2">
                <strong>Ordered Qty:</strong> {qty} Nos
              </Typography>

              <Typography variant="body2">
                <strong>Rate:</strong> ₹{rate.toLocaleString("en-IN")}
              </Typography>

              <Typography variant="body2">
                <strong>Discount:</strong> {discount}%
              </Typography>

              <Typography variant="body2">
                <strong>GST:</strong> {gst}%
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#2e7d32", fontWeight: "500" }}
              >
                <strong>Delivered Qty:</strong> {deliveredQty}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: pendingQty > 0 ? "#d32f2f" : "text.secondary",
                  fontWeight: "500",
                }}
              >
                <strong>Pending Qty:</strong> {pendingQty}
              </Typography>

              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                <strong>Item ID:</strong> {itemId}
              </Typography>

              <Box sx={{ mt: 1, pt: 1, borderTop: "1px dashed #e0e0e0" }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: "bold",
                    color: "#2e7d32",
                    fontSize: "15px",
                  }}
                >
                  <strong>Total Amount:</strong> ₹
                  {amount.toLocaleString("en-IN")}
                </Typography>
              </Box>
            </Stack>
          </Box>
        );
      });
    }

    return (
      <Stack direction="column" spacing={1.5} sx={{ pl: 1, py: 0.5 }}>
        <Typography variant="body2">
          <strong>Address:</strong> {popupData.address1 || "N/A"}
        </Typography>
        <Typography variant="body2">
          <strong>City:</strong> {popupData.city || "N/A"}
        </Typography>
        <Typography variant="body2">
          <strong>State:</strong> {popupData.state || "N/A"}
        </Typography>
        <Typography variant="body2">
          <strong>Country:</strong> {popupData.country || "N/A"}
        </Typography>
        <Typography variant="body2">
          <strong>Pincode:</strong> {popupData.pincode || "N/A"}
        </Typography>
      </Stack>
    );
  };

  // Create table NAME for columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "salesOrderNumber",
        header: "SalesOrderNumber",
        size: 50,
      },
      {
        accessorKey: "companyName",
        header: "Company Name",
        size: 50,
      },
      {
        accessorKey: "customerPoNumber",
        header: "PO Number",
        size: 50,
      },
      {
        accessorKey: "salesOrderDate",
        header: "OrderDate",
        size: 50,
      },
      {
        accessorKey: "expectedDeliveryDate",
        header: "DeliveryDate",
        size: 50,
      },
      {
        accessorKey: "paymentTerms",
        header: "Payments Terms",
        size: 50,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 50,
      },
      {
        accessorKey: "grandTotal",
        header: "Amount",
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
      {
        accessorKey: "action",
        header: "Actions",
        size: 50,
        Cell: ({ row }) => {
          const customer = row.original;
          return (
            <Stack direction="row" spacing={1}>
              <CustomButton
                className="contact"
                variant="contained"
                size="small"
                color="primary"
                sx={{ paddingY: "4px", minHeight: "unset", height: "25px" }}
                startIcon={<InventoryIcon style={{ fontSize: "14px" }} />}
                onClick={() =>
                  handleActionClick("Items Details", customer.items)
                }
              >
                Items
              </CustomButton>
              <CustomButton
                className="Billing"
                variant="contained"
                size="small"
                color="secondary"
                sx={{ paddingY: "4px", minHeight: "unset", height: "25px" }}
                startIcon={<ReceiptLongIcon style={{ fontSize: "14px" }} />}
                onClick={() =>
                  handleActionClick(
                    "Billing Address",
                    customer.billingAddressSnapshot,
                  )
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
                startIcon={<LocalShippingIcon style={{ fontSize: "14px" }} />}
                onClick={() =>
                  handleActionClick(
                    "Shipping Address",
                    customer.shippingAddressSnapshot,
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
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: FilterTable || [],
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

  return (
    <Box className="TableBoxS">
      <Typography className="heading1">SalesOrder Management</Typography>

      {/*KPI cards*/}
      <Grid container spacing={2} className="kpi-container" sx={{ mb: 3 }}>
        {/* Total Customer*/}
        <Grid item xs={12} sm={3}>
          <Box className="total">
            <Typography>Total SalesOrder</Typography>
            <Typography>{kpicard.total}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Box className="Delivered">
            <Typography>Deliveried</Typography>
            <Typography>{kpicard.Delivered}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Box className="PartiallyDelivered">
            <Typography>PartiallyDelivered</Typography>
            <Typography>{kpicard.PartiallyDelivered}</Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={3}>
          <Box className="InProduction">
            <Typography>In Production</Typography>
            <Typography>{kpicard.InProduction}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box className="Confirmed">
            <Typography>Confirmed</Typography>
            <Typography>{kpicard.Confirmed}</Typography>
          </Box>
        </Grid>
      </Grid>

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
          placeholder="Search SalesOrderNumber, Company Name..."
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
            width="200px"
          >
            <MenuItem sx={{ fontSize: "15px" }} value="all">
              All Status
            </MenuItem>
            <MenuItem sx={{ fontSize: "15px" }} value="delivered">
              Delivered
            </MenuItem>
            <MenuItem sx={{ fontSize: "15px" }} value="partially delivered">
              Partially Delivered
            </MenuItem>
            <MenuItem sx={{ fontSize: "15px" }} value="in production">
              In Production
            </MenuItem>
            <MenuItem sx={{ fontSize: "15px" }} value="confirmed">
              Confirmed
            </MenuItem>
          </CustomTextField>

          <CustomButton
            variant="contained"
            size="small"
            className="Add-SalesOrder"
            onClick={() => handleActionClick("Create New Sales Order", {})}
          >
            Add Sales Order
          </CustomButton>
        </Stack>
      </Box>

      {/* Table Render Component */}
      <MaterialReactTable table={table} />
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth={popupTitle === "Create New Sales Order" ? "md" : "xs"}
      >
        <DialogTitle className="dialog-title" sx={{ fontWeight: "bold" }}>
          {popupTitle}
        </DialogTitle>
        <DialogContent dividers className="dialog-content">
          {renderPopupcontent()}
        </DialogContent>
        <DialogActions
          className="dialog-actions"
          sx={{ p: 2, gap: 1, justifyContent: "flex-end" }}
        >
          {popupTitle === "Create New Sales Order" && (
            <CustomButton
              variant="contained"
              // color="primary"
              type="submit"
              form="add-salesorder-form"
              className="overallbtn"
              size="small"
            >
              Save Order
            </CustomButton>
          )}
          <CustomButton
            onClick={handleClose}
            variant="outlined"
            color="white"
            className="overallbtn"
            size="small"
          >
            Close
          </CustomButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Salesorder;
