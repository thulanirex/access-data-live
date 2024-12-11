import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { salesVolumeValueData } from '../../../../data/obdxData';

const SalesVolumeValueChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={salesVolumeValueData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid stroke="#f5f5f5" />
        <Bar dataKey="volume" barSize={20} fill="#413ea0" />
        <Line type="monotone" dataKey="value" stroke="#ff7300" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default SalesVolumeValueChart;
