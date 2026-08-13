import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import Customer from "../Pages/Sales/Customer";
import Quotations from "../Pages/Sales/Quotations";
import Salesorder from "../Pages/Sales/Salesorder";
import Invoice from "../Pages/Sales/invoice/Invoice";
import Vendor from "../Pages/Purchase/Vendors";
import Purchaseorder from "../Pages/Purchase/Purchaseorder";
import Goodreceipt from "../Pages/Purchase/Goodreceipt";
import Product from "../Pages/Inventory/Product";
import Stock from "../Pages/Inventory/Stock";
import Warehouse from "../Pages/Inventory/Warehouse";
import Transfer from "../Pages/Inventory/Transfer";
import Bom from "../Pages/Manufacturing/BOM";
import Productionorders from "../Pages/Manufacturing/Productionorder";
import Workorder from "../Pages/Manufacturing/Workorders";
import Accounts from "../Pages/Finance/Accounts";
import Payments from "../Pages/Finance/Payments";
import Expenses from "../Pages/Finance/Expenses";
import Reports from "../Pages/Finance/Reports";
import Employees from "../Pages/HR/Employess";
import Attendence from "../Pages/HR/Attendence";
import Leave from "../Pages/HR/Leave";
import Payroll from "../Pages/HR/Payroll";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Layout from "../Pages/Layout/Layout";

export default function PrivateRouter() {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route index element={<Dashboard />} />
      <Route path="sales">
        <Route path="customer" element={<Customer />} />
        <Route path="invoice" element={<Invoice />} />
        <Route path="quotations" element={<Quotations />} />
        <Route path="salesorder" element={<Salesorder />} />
      </Route>

      <Route path="purchase">
        <Route path="good receipt" element={<Goodreceipt />} />
        <Route path="purchase order" element={<Purchaseorder />} />
        <Route path="vendors" element={<Vendor />} />
      </Route>

      <Route path="inventory">
        <Route path="product" element={<Product />} />
        <Route path="stock" element={<Stock />} />
        <Route path="warehouse" element={<Warehouse />} />
        <Route path="transfer" element={<Transfer />} />
      </Route>

      <Route path="manufacturing">
        <Route path="BOM" element={<Bom />} />
        <Route path="productionorder" element={<Productionorders />} />
        <Route path="workorder" element={<Workorder />} />
      </Route>

      <Route path="finance">
        <Route path="accounts" element={<Accounts />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="payments" element={<Payments />} />
        <Route path="repots" element={<Reports />} />
      </Route>

      <Route path="hr">
        <Route path="attendence" element={<Attendence />} />
        <Route path="employess" element={<Employees />} />
        <Route path="leave" element={<Leave />} />
        <Route path="payroll" element={<Payroll />} />
      </Route>
    </Routes>
  );
}
