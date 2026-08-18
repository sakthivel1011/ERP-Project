import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router";

// லோடிங் டிசைனுக்கான ஸ்டைல்ஸ்
const styles = {
  loader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    fontSize: "18px",
    fontWeight: "600",
    fontFamily: "sans-serif",
    color: "#003366"
  }
};

// 🔄 ஒவ்வொரு பக்கத்திற்கும் தனித்தனியாக Suspense-ஐ சேர்க்கும் எளிய ஃபங்க்ஷன்
const DynamicPage = ({ component: Component }) => (
  <Suspense fallback={<div style={styles.loader}>🔄 Loading Page Components...</div>}>
    <Component />
  </Suspense>
);

// Dashboard & Layout
const Dashboard = lazy(() => import("../Pages/Dashboard/Dashboard"));
const Layout = lazy(() => import("../Pages/Layout/Layout"));

// Sales Components
const Customer = lazy(() => import("../Pages/Sales/Customer/Customer"));
const Quotations = lazy(() => import("../Pages/Sales/Quotations"));
const Salesorder = lazy(() => import("../Pages/Sales/Salesorder"));
const Invoice = lazy(() => import("../Pages/Sales/invoice/Invoice"));

// Purchase Components
const Vendor = lazy(() => import("../Pages/Purchase/Vendors"));
const Purchaseorder = lazy(() => import("../Pages/Purchase/Purchaseorder"));
const Goodreceipt = lazy(() => import("../Pages/Purchase/Goodreceipt"));

// Inventory Components
const Product = lazy(() => import("../Pages/Inventory/Product"));
const Stock = lazy(() => import("../Pages/Inventory/Stock"));
const Warehouse = lazy(() => import("../Pages/Inventory/Warehouse"));
const Transfer = lazy(() => import("../Pages/Inventory/Transfer"));

// Manufacturing Components
const Bom = lazy(() => import("../Pages/Manufacturing/BOM"));
const Productionorders = lazy(() => import("../Pages/Manufacturing/Productionorder"));
const Workorder = lazy(() => import("../Pages/Manufacturing/Workorders"));

// Finance Components
const Accounts = lazy(() => import("../Pages/Finance/Accounts"));
const Payments = lazy(() => import("../Pages/Finance/Payments"));
const Expenses = lazy(() => import("../Pages/Finance/Expenses"));
const Reports = lazy(() => import("../Pages/Finance/Reports"));

// HR Components
const Employees = lazy(() => import("../Pages/HR/Employess"));
const Attendence = lazy(() => import("../Pages/HR/Attendence"));
const Leave = lazy(() => import("../Pages/HR/Leave"));
const Payroll = lazy(() => import("../Pages/HR/Payroll"));

export default function PrivateRouter() {
  return (
    <Routes>
      <Route path="dashboard" element={<DynamicPage component={Dashboard} />} />
      <Route index element={<DynamicPage component={Dashboard} />} />

      {/* Sales Group */}
      <Route path="sales">
        <Route path="customer" element={<DynamicPage component={Customer} />} />
        <Route path="invoice" element={<DynamicPage component={Invoice} />} />
        <Route path="quotations" element={<DynamicPage component={Quotations} />} />
        <Route path="salesorder" element={<DynamicPage component={Salesorder} />} />
      </Route>

      {/* Purchase Group */}
      <Route path="purchase">
        <Route path="good receipt" element={<DynamicPage component={Goodreceipt} />} />
        <Route path="purchase order" element={<DynamicPage component={Purchaseorder} />} />
        <Route path="vendors" element={<DynamicPage component={Vendor} />} />
      </Route>

      {/* Inventory Group */}
      <Route path="inventory">
        <Route path="product" element={<DynamicPage component={Product} />} />
        <Route path="stock" element={<DynamicPage component={Stock} />} />
        <Route path="warehouse" element={<DynamicPage component={Warehouse} />} />
        <Route path="transfer" element={<DynamicPage component={Transfer} />} />
      </Route>

      {/* Manufacturing Group */}
      <Route path="manufacturing">
        <Route path="BOM" element={<DynamicPage component={Bom} />} />
        <Route path="productionorder" element={<DynamicPage component={Productionorders} />} />
        <Route path="workorder" element={<DynamicPage component={Workorder} />} />
      </Route>

      {/* Finance Group */}
      <Route path="finance">
        <Route path="accounts" element={<DynamicPage component={Accounts} />} />
        <Route path="expenses" element={<DynamicPage component={Expenses} />} />
        <Route path="payments" element={<DynamicPage component={Payments} />} />
        <Route path="repots" element={<DynamicPage component={Reports} />} />
      </Route>

      {/* HR Group */}
      <Route path="hr">
        <Route path="attendence" element={<DynamicPage component={Attendence} />} />
        <Route path="employess" element={<DynamicPage component={Employees} />} />
        <Route path="leave" element={<DynamicPage component={Leave} />} />
        <Route path="payroll" element={<DynamicPage component={Payroll} />} />
      </Route>
    </Routes>
  );
}
