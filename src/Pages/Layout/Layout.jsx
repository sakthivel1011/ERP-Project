import { Link, Outlet, useNavigate } from "react-router";
import { useState } from "react";
import "./layout.css";
export default function Layout() {
  const [open, setOpen] = useState(false);
  const [purchase, setPurchase] = useState(false);
  const [inventory, setInventory] = useState(false);
  const [manufacturing, setManufacturing] = useState(false);
  const [finance, setFinance] = useState(false);
  const [hr, setHr] = useState(false);
  return (
    <>
      <h2>ERP ADMIN PANEL</h2>
      <div className="main">
        <nav className="sidebar">
          <Link to="/"><button className="b1">🏠Dashboard</button></Link>
          <div>
            <button className="b1" onClick={() => setOpen(!open)}>
              {" "}
              <b>📊Sales</b>
            </button>
            {open && (
              <ul className="bullet">
                <li>
                  <Link to="/sales/customer">Customer</Link>
                </li>
                <li>
                  <Link to="/sales/invoice">Invoice</Link>
                </li>
                <li>
                  <Link to="/sales/quotations">Quottions</Link>
                </li>
                <li>
                  <Link to="/sales/salesorder">Salesorder</Link>
                </li>
              </ul>
            )}
          </div>

          <div>
            <button className="b1" onClick={() => setPurchase(!purchase)}>
              🛒 Purchase
            </button>
            {purchase && (
              <ul className="bullet">
                <li>
                  <Link to="/Purchase/Good receipt">Good Receipt</Link>
                </li>
                <li>
                  <Link to="/Purchase/Purchase order">Purchase Order</Link>
                </li>
                <li>
                  <Link to="/Purchase/Vendors">Vendors</Link>
                </li>
              </ul>
            )}
          </div>

          <div>
            <button className="b1" onClick={() => setInventory(!inventory)}>
              📦 Inventory
            </button>
            {inventory && (
              <ul className="bullet">
                <li>
                  <Link to="/inventory/product">Product</Link>
                </li>
                <li>
                  <Link to="/inventory/Stock">Stock</Link>
                </li>
                <li>
                  <Link to="/inventory/Transfer">Transfer</Link>
                </li>
                <li>
                  <Link to="/inventory/Warehouse">Warehouse</Link>
                </li>
              </ul>
            )}
          </div>

          <div>
            <button
              className="b1"
              onClick={() => setManufacturing(!manufacturing)}
            >
              🏭 Manufacturing
            </button>
            {manufacturing && (
              <ul className="bullet">
                <li>
                  <Link to="/Manufacturing/BOM">BOM</Link>
                </li>
                <li>
                  <Link to="/Manufacturing/Productionorder">
                    Productionorder
                  </Link>
                </li>
                <li>
                  <Link to="/Manufacturing/Workorder">Workorders</Link>
                </li>
              </ul>
            )}
          </div>

          <div>
            <button className="b1" onClick={() => setFinance(!finance)}>
              💰 Finance
            </button>
            {finance && (
              <ul className="bullet">
                <li>
                  <Link to="/Finance/Accounts">Accounts</Link>
                </li>
                <li>
                  <Link to="/Finance/Expenses">Expenses</Link>
                </li>
                <li>
                  <Link to="/Finance/Payments">Payments</Link>
                </li>
                <li>
                  <Link to="/Finance/Repots">Reports</Link>
                </li>
              </ul>
            )}
          </div>
          <div>
            <button className="b1" onClick={() => setHr(!hr)}>
              👥 HR
            </button>
            {hr && (
              <ul className="bullet">
                <li>
                  <Link to="/HR/Attendence">Attendence</Link>
                </li>
                <li>
                  <Link to="/HR/Employess">Employess</Link>
                </li>
                <li>
                  <Link to="/HR/Leave">Leave</Link>
                </li>
                <li>
                  <Link to="/HR/Payroll">Payroll</Link>
                </li>
              </ul>
            )}
          </div>
        </nav>
        <div className="right">
        <Outlet />
      </div>
      </div>
      
    </>
  );
}
