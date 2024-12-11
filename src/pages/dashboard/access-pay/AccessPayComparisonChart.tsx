import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  {
    name: 'Transactions',
    yesterday: 345,
    today: 1548,
  },
  {
    name: 'Success Rate',
    yesterday: 81.7,
    today: 91.4,
  },
  // {
  //   name: 'Avg Value',
  //   yesterday: 1180,
  //   today: 1250,
  // },
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
        <Bar dataKey="yesterday" fill="#82ca9d" name="Yesterday" />
        <Bar dataKey="today" fill="#8884d8" name="Today" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ATMComparisonChart;