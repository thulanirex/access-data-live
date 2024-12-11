import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const IncidentFrequencyData = [
    { period: 'Today', incidents: 7 },
    { period: 'This Week', incidents: 20 },
    { period: 'This Month', incidents: 75 },
    { period: 'This Quarter', incidents: 200 },
    { period: 'This Year', incidents: 800 }
];

const IncidentFrequencyChart = () => (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart data={IncidentFrequencyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="incidents" fill="#8884d8" />
        </BarChart>
    </ResponsiveContainer>
);

export default IncidentFrequencyChart;
