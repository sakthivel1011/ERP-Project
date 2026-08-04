import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#6366F1", "#10B981", "#F59E0B"];
export default function Inventorychart({ chartData1 }) {
  return (
    <></>
    // <PieChart className="pie" width={500} height={300}>
    //   <Pie
    //     data={chartData1}
    //     dataKey="items"
    //     nameKey="category"
    //     cx="50%"
    //     cy="50%"
    //     outerRadius={80}
    //     label
    //   >
    //     {chartData1.map((entry, index) => (
    //       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    //     ))}
    //   </Pie>
    //   <Tooltip />
    // </PieChart>
  );
}
