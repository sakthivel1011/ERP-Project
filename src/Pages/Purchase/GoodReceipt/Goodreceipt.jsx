import {
  Box,
  Stack,
  Typography,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import React, { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import CustomTextField from "../../../Components/CustomField";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { goodsReceiptNoteSchema } from "../../../Validation/GRNValidationSchema";

//ICONS
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import "./GoodReceipt.scss"; //scss file for style and alignment
import CustomButton from "../../../components/CustomButton"; // custombutton for reuse the properties

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"; //popup msg and action button ku

import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { fetchAllUsers } from "../../../Redux/userSlice"; // get data from redux

function Goodreceipt() {
  //================//
  // redux API Data
  //================//

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

  //============//
  //KPI card
  //============//
  const kpicard = useMemo(() => {
    const grnList = liveData?.goodsReceiptNotes || [];
    const rawItems = grnList.flatMap((grn) => grn.items || []);

    let totalOrdered = 0;
    let totalReceived = 0;
    let totalAccepted = 0;
    let totalRejected = 0;
    let totalPending = 0;

    // Loop through every item to calculate totals
    rawItems.forEach((item) => {
      totalOrdered += item.orderedQty || 0;
      totalReceived += item.receivedQty || 0;
      totalAccepted += item.acceptedQty || 0;
      totalRejected += item.rejectedQty || 0;
      totalPending += item.pendingQty || 0;
    });

    return {
      totalOrdered,
      totalReceived,
      totalAccepted,
      totalRejected,
      totalPending,
    };
  }, [liveData]);

  // Filter Fields
  const [statusfilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  //Form creation
  const {
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(goodsReceiptNoteSchema),
    defaultValues: {
      grnNumber: "GRN-2026-0006",
      grnDate: new Date().toISOString().split("T")[0],
      purchaseOrderNumber: "",
      warehouseName: "Main Warehouse",
      receivedBy: "Arun Kumar",
      vendorName: "",
      vehicleNumber: "",
      transporterName: "",
      driverName: "",
      driverMobile: "",
      items: [
        {
          itemCode: "",
          description: "",
          orderedQty: "",
          receivedQty: "",
          acceptedQty: "",
          rejectedQty: "",
          inspectionStatus: "Passed",
          remarks: "",
        },
      ],
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
    console.log("New GRN Logged Successfully:", formData);
    handleClose();
  };

  //==============//
  //popup state
  //==============//
  const [open, setOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState("");
  const [popupData, setPopupData] = useState(null);

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

  const renderPopupcontent = () => {
    if (popupTitle === "Create New Goods Received Note") {
      return (
        <form
          id="add-grn-form"
          onSubmit={handleSubmit(onFormSubmit)}
          noValidate
        >
          <Grid container spacing={2.5} rowSpacing={4.5} sx={{ pt: 1 }}>
            {/* SECTION 1: PRIMARY DETAILS */}
            <Grid  xs={12}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", color: "primary.main" }}
              >
               1. GOODS RECEIVED NOTE DETAILS
              </Typography>
            </Grid>
            <Grid  xs={12} sm={4}>
              <Controller
                name="grnNumber"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    
                    label="GRN Number"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
            <Grid  xs={12} sm={4}>
              <Controller
                name="grnDate"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    type="date"
                    label="GRN Date"
                    InputLabelProps={{ shrink: true }}
                    size="small"
                    error={!!errors.grnDate}
                    helperText={errors.grnDate?.message}
                  />
                )}
              />
            </Grid>
            <Grid xs={12} sm={4}>
              <Controller
                name="purchaseOrderNumber"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label="Select Purchase Order"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                    error={!!errors.purchaseOrderNumber}
                    helperText={errors.purchaseOrderNumber?.message}
                    SelectProps={{ MenuProps: { disablePortal: true } }}
                  >
                    <MenuItem value="" disabled>
                      Select Purchase Order
                    </MenuItem>
                    {(liveData?.goodsReceiptNotes || []).map((po) => (
                      <MenuItem key={po.grnId} value={po.purchaseOrderNumber}>
                        {po.purchaseOrderNumber}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid  xs={12} sm={6}>
              <Controller
                name="warehouseName"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    select
                    fullWidth
                    label="Target Warehouse"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  >
                    <MenuItem value="Main Warehouse">Main Warehouse</MenuItem>
                    <MenuItem value="Production Warehouse">
                      Production Warehouse
                    </MenuItem>
                  </CustomTextField>
                )}
              />
            </Grid>
            <Grid xs={12} sm={6}>
              <Controller
                name="receivedBy"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Received By"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
            {/* SECTION 2: VENDOR & LOGISTICS DETAILS */}
            <Grid  xs={12}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", mt: 1, color: "primary.main" }}
              >
                 2. VENDOR & LOGISTICS DETAILS
              </Typography>
            </Grid>
            <Grid  xs={12} sm={4}>
              <Controller
                name="vendorName"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Vendor Name"
                    placeholder="Vendor Name"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
            <Grid  xs={12} sm={4}>
              <Controller
                name="vehicleNumber"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Vehicle Number"
                    placeholder="e.g. TN55AB1234"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
            <Grid  xs={12} sm={4}>
              <Controller
                name="transporterName"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Transporter Name"
                    placeholder="e.g. ABC Logistics"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
            <Grid  xs={12} sm={6}>
              <Controller
                name="driverName"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Driver Name"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>
            <Grid  xs={12} sm={6}>
              <Controller
                name="driverMobile"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    fullWidth
                    label="Driver Mobile Number"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
              />
            </Grid>{" "}
            {/* SECTION 3: PRODUCT ITEMS BREAKDOWN LIST */}
            <Grid xs={12}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", mt: 1, mb: 1, color: "primary.main" }}
              >
                 3. PRODUCT ITEMS 
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
                      Material Product Item #{index + 1}
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
                    <Grid xs={12} sm={4}>
                      <Controller
                        name={`items.${index}.itemCode`}
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label="Item Code"
                            placeholder="e.g. PRD017"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors?.items?.[index]?.itemCode}
                            helperText={
                              errors?.items?.[index]?.itemCode?.message
                            }
                          />
                        )}
                      />
                    </Grid>

                    <Grid xs={12} sm={8}>
                      <Controller
                        name={`items.${index}.description`}
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label="Item Description"
                            placeholder="e.g. CS Fin Tube"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            error={!!errors?.items?.[index]?.description}
                            helperText={
                              errors?.items?.[index]?.description?.message
                            }
                          />
                        )}
                      />
                    </Grid>

                    {/* QUANTITIES ROW INLINE */}
                    <Grid  xs={12} sm={3}>
                      <Controller
                        name={`items.${index}.orderedQty`}
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            type="number"
                            label="Ordered Qty"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid xs={12} sm={3}>
                      <Controller
                        name={`items.${index}.receivedQty`}
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            type="number"
                            label="Received Qty"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid  xs={12} sm={3}>
                      <Controller
                        name={`items.${index}.acceptedQty`}
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            type="number"
                            label="Accepted Qty"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid xs={12} sm={3}>
                      <Controller
                        name={`items.${index}.rejectedQty`}
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            type="number"
                            label="Rejected Qty"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            
                            
                          />
                        )}
                      />
                    </Grid>

                    <Grid  xs={12} sm={6}>
                      <Controller
                        name={`items.${index}.inspectionStatus`}
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            select
                            fullWidth
                            label="Inspection Status"
                            size="small"
                            InputLabelProps={{ shrink: true }}
                          >
                            <MenuItem value="Passed">Passed</MenuItem>
                            <MenuItem value="Partially Passed">
                              Partially Passed
                            </MenuItem>
                            <MenuItem value="Failed">Failed</MenuItem>
                          </CustomTextField>
                        )}
                      />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <Controller
                        name={`items.${index}.remarks`}
                        control={control}
                        render={({ field }) => (
                          <CustomTextField
                            {...field}
                            fullWidth
                            label="Inspection Remarks"
                            placeholder="Notes..."
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
                onClick={() =>
                  appendItem({
                    itemCode: "",
                    description: "",
                    orderedQty: "",
                    receivedQty: "",
                    acceptedQty: "",
                    rejectedQty: 0,
                    inspectionStatus: "Passed",
                    remarks: "",
                  })
                }
                sx={{ mt: 1 }}
              >
                + Add Another Material Item
              </CustomButton>
            </Grid>
          </Grid>
        </form>
      );
    }

    if (!popupData) return null;
    if (popupTitle === "Items Details" && Array.isArray(popupData)) {
      return popupData.map((item, index) => {
        const grnItemId = item.grnItemId || "N/A";
        const itemCode = item.itemCode || "N/A";
        const description = item.description || 0;
        const orderedQty = item.orderedQty || 0;
        const receivedQty = item.receivedQty || 0;
        const acceptedQty = item.acceptedQty || 0;
        const rejectedQty = item.rejectedQty || 0;
        const pendingQty = item.pendingQty ?? 0;
        const unit = item.unit ?? 0;
        const batchNumber = item.batchNumber || "N/A";
        const inspectionStatus = item.inspectionStatus || "N/A";
        const remarks = item.remarks || "N/A";

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
              GRN Item Id {grnItemId}
            </Typography>

            <Stack direction="column" spacing={1.5} sx={{ pl: 1 }}>
              <Typography variant="body2">
                <strong>Item Code:</strong> {itemCode}
              </Typography>

              <Typography variant="body2">
                <strong>Description:</strong> {description}
              </Typography>

              <Typography variant="body2">
                <strong>OrderedQty:</strong>
                {orderedQty}Nos
              </Typography>

              <Typography variant="body2">
                <strong>ReceivedQty</strong> {receivedQty}Nos
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#2e7d32", fontWeight: "500" }}
              >
                <strong>AcceptedQty:</strong> {acceptedQty}Nos
              </Typography>

              <Typography variant="body2">
                <strong
                  sx={{
                    color: receivedQty > 0 ? "#d32f2f" : "text.secondary",
                    fontWeight: "500",
                  }}
                >
                  RejectedQty:
                </strong>{" "}
                {rejectedQty}Nos
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: pendingQty > 0 ? "#f5e105" : "text.secondary",
                  fontWeight: "500",
                }}
              >
                <strong>Pending Qty:</strong> {pendingQty}
              </Typography>

              <Typography variant="body2">
                <strong>Unit:</strong> {unit}
              </Typography>

              <Typography variant="body2">
                <strong>BatchNumber:</strong> {batchNumber}
              </Typography>

              <Typography variant="body2">
                <strong>Inspection Status:</strong> {inspectionStatus}
              </Typography>

              <Typography variant="body2">
                <strong>Remarks:</strong> {remarks}
              </Typography>
            </Stack>
          </Box>
        );
      });
    }

    return (
      <Stack direction="column" spacing={1.5} sx={{ pl: 1, py: 0.5 }}>
        <Typography variant="body2">
          <strong>DeliveryNoteNumber:</strong>{" "}
          {popupData.deliveryNoteNumber || "N/A"}
        </Typography>
        <Typography variant="body2">
          <strong>DeliveryNoteDate:</strong>{" "}
          {popupData.deliveryNoteDate || "N/A"}
        </Typography>
        <Typography variant="body2">
          <strong>VehicleNumber:</strong> {popupData.vehicleNumber || "N/A"}
        </Typography>
        <Typography variant="body2">
          <strong>TransporterName:</strong> {popupData.transporterName || "N/A"}
        </Typography>
        <Typography variant="body2">
          <strong>DriverName</strong> {popupData.driverName || "N/A"}
        </Typography>
      </Stack>
    );
  };
  const FilterTable = useMemo(() => {
    // Live data show in table customer company name and Salesorder Data
    if (!liveData) return [];

    // const customers = liveData.customers || [];
    const GRN = liveData.goodsReceiptNotes || [];

    let mappedGRNs = [...GRN];

    //  DROPDOWN FILTER LOGIC
    if (statusfilter && statusfilter !== "all") {
      mappedGRNs = mappedGRNs.filter(
        (grn) => grn.status?.toLowerCase() === statusfilter.toLowerCase(),
      );
    }

    // serach bar logic
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();

      mappedGRNs = mappedGRNs.filter((grn) => {
        const grnNum = grn.grnNumber ? String(grn.grnNumber).toLowerCase() : "";
        const poNum = grn.purchaseOrderNumber
          ? String(grn.purchaseOrderNumber).toLowerCase()
          : "";
        const vendName = grn.vendorName
          ? String(grn.vendorName).toLowerCase()
          : "";
        const statusText = grn.status ? String(grn.status).toLowerCase() : "";

        return (
          grnNum.includes(query) ||
          poNum.includes(query) ||
          vendName.includes(query) ||
          statusText.includes(query)
        );
      });
    }

    return mappedGRNs;
  }, [liveData, searchQuery, statusfilter]);

  // Create table NAME for columns
  const columns = useMemo(() => [
    {
      accessorKey: "grnNumber",
      header: "GRN Number",
      size: 50,
    },
    {
      accessorKey: "purchaseOrderNumber",
      header: "PO Number",
      size: 50,
    },
    {
      accessorKey: "vendorName",
      header: "Vendor Name",
      size: 80,
    },
    {
      accessorKey: "receivedDate",
      header: "Received Date",
      size: 50,
    },
    {
      accessorKey: "grnDate",
      header: "GRN Date",
      size: 50,
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 50,
    },
    {
      accessorKey: "action",
      header: "Actions",
      size: 50,
      Cell: ({ row }) => {
        const GRN = row.original;
        return (
          <Stack direction="row" spacing={1}>
            <CustomButton
              className="Item"
              variant="contained"
              size="small"
              color="primary"
              sx={{ paddingY: "4px", minHeight: "unset", height: "25px" }}
              startIcon={<InventoryIcon style={{ fontSize: "14px" }} />}
              onClick={() => handleActionClick("Items Details", GRN.items)}
            >
              Items
            </CustomButton>
            <CustomButton
              className="DeliveryDetails"
              variant="contained"
              size="small"
              color="secondary"
              sx={{ paddingY: "4px", minHeight: "unset", height: "25px" }}
              startIcon={<LocalShippingIcon style={{ fontSize: "14px" }} />}
              onClick={() =>
                handleActionClick("Delivery Details", GRN.deliveryDetails)
              }
            >
              Delivery
            </CustomButton>
          </Stack>
        );
      },
    },
  ]);

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
    <Box className="TableBoxG">
      <Typography className="heading1">Goods Receipt Management</Typography>

      <Grid container spacing={2} className="kpi-container" sx={{ mb: 3 }}>
        {/* Total Ordered Quantity Card */}
        <Grid  xs={12} sm={3}>
          <Box className="totalorder">
            <Typography>Total Ordered Qty</Typography>
            <Typography>{kpicard.totalOrdered}</Typography>
          </Box>
        </Grid>

        {/* Total Received Quantity Card */}
        <Grid  xs={12} sm={3}>
          <Box className="Received">
            <Typography>Received Qty</Typography>
            <Typography>{kpicard.totalReceived}</Typography>
          </Box>
        </Grid>

        {/* Total Accepted Quantity Card */}
        <Grid  xs={12} sm={3}>
          <Box className="totalaccepted">
            <Typography>Accepted Qty</Typography>
            <Typography>{kpicard.totalAccepted}</Typography>
          </Box>
        </Grid>
        {/* Total Pending Quantity Card */}
        <Grid  xs={12} sm={3}>
          <Box className="totalpending">
            <Typography>Pending Qty</Typography>
            <Typography>{kpicard.totalPending}</Typography>
          </Box>
        </Grid>

        {/* Total Rejected Quantity Card */}
        <Grid xs={12} sm={3}>
          <Box className="totalrejected">
            <Typography>Rejected Qty</Typography>
            <Typography>{kpicard.totalRejected}</Typography>
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
          placeholder="Search GRN ID, Vendor Name..."
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
            <MenuItem sx={{ fontSize: "15px" }} value="fully Received">
              Fully Received
            </MenuItem>
            <MenuItem sx={{ fontSize: "15px" }} value="Partially Received">
              Partially Received
            </MenuItem>
          </CustomTextField>

          <CustomButton
            variant="contained"
            size="small"
            className="Add-SalesOrder"
            onClick={() => handleActionClick("Create New Goods Received Note", {})}
          >
            Add GRN
          </CustomButton>
        </Stack>
      </Box>

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
          {popupTitle === "Create New Goods Received Note" && (
            <CustomButton
              variant="contained"
              // color="primary"
              type="submit"
              form="add-grn-form"
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

export default Goodreceipt;
