import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Saleschart({chartData}) {
  return (
    
   <BarChart className='barchart' width={600} height={300} margin={{top:20,right:30,left:200,bottom:5}} data={chartData}>
      <XAxis dataKey="month" />
      <YAxis dataKey="sales"/>                 
      <Bar dataKey="sales" fill="blue" radius={[6,6,0,0]}/> 
    </BarChart>

  )
}
