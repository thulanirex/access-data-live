import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ResolutionTimeData = [
    { period: 'Today', highPriority: 2, lowPriority: 5 },
    { period: 'This Week', highPriority: 3, lowPriority: 4 },
    { period: 'This Month', highPriority: 4, lowPriority: 6 },
    { period: 'This Quarter', highPriority: 3, lowPriority: 7 },
    { period: 'This Year', highPriority: 5, lowPriority: 8 }
];

const IssueResolutionTimeChart = () => (
    <ResponsiveContainer width="100%" height={300}>
        <LineChart data={ResolutionTimeData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="highPriority" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="lowPriority" stroke="#82ca9d" />
        </LineChart>
    </ResponsiveContainer>
);

export default IssueResolutionTimeChart;
