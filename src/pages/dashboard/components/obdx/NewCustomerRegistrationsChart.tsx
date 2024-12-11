import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { newCustomersData } from '../../../../data/obdxData';

const NewCustomerRegistrationsChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={newCustomersData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="newCustomers" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default NewCustomerRegistrationsChart;
