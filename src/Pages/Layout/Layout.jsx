import { Link, Outlet, useNavigate } from "react-router";
import { useState } from "react";
import "./layout.scss";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
export default function Layout() {
  const [open, setOpen] = useState(false);
  const [purchase, setPurchase] = useState(false);
  const [inventory, setInventory] = useState(false);
  const [manufacturing, setManufacturing] = useState(false);
  const [finance, setFinance] = useState(false);
  const [hr, setHr] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  return (
    <>
      <div className="main">
        <nav className="sidebar">
          <h2 className="Erp-admin">ERP ADMIN </h2>
          <Link to="/"  onClick={() => setActiveLink("dashboard")}><button className={`b1 ${activeLink === "dashboard" ? "active" : ""}`}>Dashboard</button></Link>
          <div>
            <button className="b1" onClick={() => setOpen(!open)}>
              {" "}
              Sales
            </button>
            {open && (
              <ul className="bullet">
                <div className="div">
                <li>
                  <Link className={`link-color ${activeLink === "customer" ? "active" : ""}`} to="/sales/customer" onClick={() => setActiveLink("customer")}>Customer</Link>
                </li>
                <li>
                  <Link className={`link-color ${activeLink === "invoice" ? "active" : ""}`} to="/sales/invoice" onClick={()=>setActiveLink("invoice")}>Invoice</Link>
                </li>
                <li>
                  <Link className={`link-color ${activeLink === "quotations" ? "active" :""}`} to="/sales/quotations" onClick={()=>setActiveLink("quotations")}>Quotations</Link>
                </li>
                <li>
                  <Link className={`link-color ${activeLink === "salesorder" ? "active" :""}`}  to="/sales/salesorder" onClick={()=>setActiveLink("salesorder")}>Salesorder</Link>
                </li>
                </div>
              </ul>
            )}
          </div>

          <div>
            <button className="b1" onClick={() => setPurchase(!purchase)}>
               Purchase
            </button>
            {purchase && (
              <ul className="bullet">
                <li>
                  <Link className={`link-color ${activeLink === "Good receipt" ? "active" :""}`} to="/Purchase/Good receipt" onClick={()=>setActiveLink("Good receipt")}>Good Receipt</Link>
                </li>
                <li>
                  <Link className={`link-color ${activeLink === "Purchase order" ? "active" :""}`}  to="/Purchase/Purchase order" onClick={()=>setActiveLink("Purchase order")}>Purchase Order</Link>
                </li>
                <li>
                  <Link className={`link-color ${activeLink === "Vendors" ? "active" :""}`}  to="/Purchase/Vendors" onClick={()=>setActiveLink("Vendors")}>Vendors</Link>
                </li>
              </ul>
            )}
          </div>

          <div>
            <button className="b1" onClick={() => setInventory(!inventory)}>
               Inventory
            </button>
            {inventory && (
              <ul className="bullet">
                <li>
                  <Link className={`link-color ${activeLink === "product" ? "active" :""}`}  to="/inventory/product" onClick={()=>setActiveLink("product")}>Product</Link>
                </li>
                <li>
                  <Link className={`link-color ${activeLink === "Stock" ? "active" :""}`}  to="/inventory/Stock" onClick={()=>setActiveLink("Stock")}>Stock</Link>
                </li>
                <li>
                  <Link className={`link-color ${activeLink === "Transfer" ? "active" :""}`}  to="/inventory/Transfer" onClick={()=>setActiveLink("Transfer")}>Transfer</Link>
                </li>
                <li>
                  <Link className={`link-color ${activeLink === "Warehouse" ? "active" :""}`}  to="/inventory/Warehouse" onClick={()=>setActiveLink("Warehouse")}>Warehouse</Link>
                </li>
              </ul>
            )}
          </div>

          <div>
            <button
              className="b1"
              onClick={() => setManufacturing(!manufacturing)}
            >
               Manufacturing
            </button>
            {manufacturing && (
              <ul className="bullet">
                <li>
                  <Link className={`link-color ${activeLink === "BOM" ? "active" :""}`} to="/Manufacturing/BOM" onClick={()=>setActiveLink("BOM")}>BOM</Link>
                </li>
                <li>
                  <Link className={`link-color ${activeLink === "Productionorder" ? "active" :""}`} to="/Manufacturing/Productionorder" onClick={()=>setActiveLink("Productionorder")}>
                    Productionorder
                  </Link>
                </li>
                <li>
                  <Link className={`link-color ${activeLink === "Workorder" ? "active" :""}`} to="/Manufacturing/Workorder" onClick={()=>setActiveLink("Workorder")}>Workorders</Link>
                </li>
              </ul>
            )}
          </div>

          <div>
            <button className="b1" onClick={() => setFinance(!finance)}>
               Finance
            </button>
            {finance && (
              <ul className="bullet">
                <li>
                  <Link className={`link-color ${activeLink === "Accounts" ? "active" :""}`} to="/Finance/Accounts" onClick={()=>setActiveLink("Accounts")}>Accounts</Link>
                </li>
                <li>
                  <Link className={`link-color ${activeLink === "Expenses" ? "active" :""}`} to="/Finance/Expenses" onClick={()=>setActiveLink("Expenses")}>Expenses</Link>
                </li>
                <li>
                  <Link className={`link-color ${activeLink === "Payments" ? "active" :""}`} to="/Finance/Payments"onClick={()=>setActiveLink("Payments")}>Payments</Link>
                </li>
                <li>
                  <Link className={`link-color ${activeLink === "Reports" ? "active" :""}`} to="/Finance/Repots" onClick={()=>setActiveLink("Reports")}>Reports</Link>
                </li>
              </ul>
            )}
          </div>
          <div>
            <button className="b1" onClick={() => setHr(!hr)}>
               HR
            </button>
            {hr && (
              <ul className="bullet">
                <li>
                  <Link className={`link-color ${activeLink === "Attendence" ? "active" :""}`} to="/HR/Attendence" onClick={()=>setActiveLink("Attendence")}>Attendence</Link>
                </li>
                <li>
                  <Link className={`link-color ${activeLink === "Employess" ? "active" :""}`} to="/HR/Employess" onClick={()=>setActiveLink("Employess")}>Employess</Link>
                </li>
                <li>
                  <Link className={`link-color ${activeLink === "Leave" ? "active" :""}`} to="/HR/Leave" onClick={()=>setActiveLink("Leave")}>Leave</Link>
                </li>
                <li>
                  <Link className={`link-color ${activeLink === "Payroll" ? "active" :""}`} to="/HR/Payroll" onClick={()=>setActiveLink("Payroll")}>Payroll</Link>
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
