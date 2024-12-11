import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const incidentTrendData = [
    { month: 'Jan', Tenga: 20, ATMs: 30, OBDX: 5 },
    { month: 'Feb', Tenga: 25, ATMs: 25, OBDX: 3 },
    { month: 'Mar', Tenga: 20, ATMs: 30, OBDX: 5 },
    { month: 'April', Tenga: 35, ATMs: 25, OBDX: 3 },
    { month: 'May', Tenga: 40, ATMs: 30, OBDX: 5 },
    { month: 'June', Tenga: 27, ATMs: 45, OBDX: 4 },
    // Add other months and channels
];

const IncidentTrendsChart = () => (
    <ResponsiveContainer width="100%" height={300}>
        <LineChart data={incidentTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Tenga" stroke="#8884d8" />
            <Line type="monotone" dataKey="ATMs" stroke="#82ca9d" />
            <Line type="monotone" dataKey="OBDX" stroke="#ffc658" />
        </LineChart>
    </ResponsiveContainer>
);

export default IncidentTrendsChart;
