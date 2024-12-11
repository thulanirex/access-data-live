import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { depositsWithdrawalsData } from '../../../../data/obdxData';

const DepositsWithdrawalsChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={depositsWithdrawalsData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="deposits" fill="#8884d8" />
        <Bar dataKey="withdrawals" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DepositsWithdrawalsChart
