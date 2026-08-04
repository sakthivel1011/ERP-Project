import React from "react";
import SalesChart from "../chart/Saleschart";
// import Inventorychart from "./chart/Inventorychart";
import { dashboarddata } from "../../Data/Dashboarddata";
function Dashboard() {
  const { sales } = dashboarddata.dashboard;
  const { inventory } = dashboarddata.dashboard;
  return (
    <div>
      <SalesChart chartData={sales.monthlySales} />
      {/* <Inventorychart chartData1={inventory.stockCategories}/> */}
    </div>
  );
}
export default Dashboard;
