import React from 'react';
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';
import { successFailureData } from '../../../../data/MobileBankingData';

const SuccessFailurePieChart: React.FC = () => {
  const COLORS = ['#00C49F', '#FF8042'];
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie data={successFailureData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
          {successFailureData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SuccessFailurePieChart;
