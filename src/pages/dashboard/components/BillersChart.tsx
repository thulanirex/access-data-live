import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { BillerData } from './BillersData';

interface BillersChartProps {
  data: BillerData[];
}

const BillersChart: React.FC<BillersChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="biller" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="successfulValue" fill="#4CAF50" name="Successful Value" />
        <Bar dataKey="failedValue" fill="#F44336" name="Failed Value" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BillersChart;
