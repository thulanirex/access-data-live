import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  {
    name: 'Yesterday',
    financial: 5197,
    others: 11782,
  },

  {
    name: 'Today',
    financial: 3484,
    others: 17247,
  },
];

const ATMComparisonChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="financial" fill="#82ca9d" name="Financial Transactions" />
        <Bar dataKey="others" fill="#8884d8" name="Non-Financial Transactions" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ATMComparisonChart;