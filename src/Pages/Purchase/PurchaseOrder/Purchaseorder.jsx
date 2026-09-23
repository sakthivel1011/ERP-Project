import {
  Box,
  Stack,
  Typography,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import "./Purchaseorder.scss"; //scss file for style and alignment
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import React, { useMemo, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../Redux/hooks";
import { fetchAllUsers } from "../../../Redux/userSlice"; // get data from redux

function Purchaseorder() {
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

  // Create table NAME for columns
  const columns = useMemo(() => [
    {
      accessorKey: "PO Number",
      header: "PO Number",
      size: 50,
    },
    {
      accessorKey: "PO Date",
      header: "PO Date",
      size: 50,
    },
    {
      accessorKey: "Vendore Code",
      header: "Vendore Code",
      size: 50,
    },
    {
      accessorKey: "Vendore Name",
      header: "Vendore Name",
      size: 50,
    },
    {
      accessorKey: "Target Warehouse",
      header: "Target Warehouse",
      size: 50,
    },
    {
      accessorKey: "Payment Terms",
      header: "Payment Terms",
      size: 50,
    },
    {
      accessorKey: "Status",
      header: "Status",
      size: 50,
    },
    {
      accessorKey: "Total",
      header: "Total",
      size: 50,
    },
  ]);

    const table = useMaterialReactTable({
      columns,
      data: [],
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
    <Box className="TableBoxP">
      <Typography className="heading1">Purchase Order Management</Typography>
      <MaterialReactTable table={table} />
    </Box>
    
  );
}
export default Purchaseorder;
