import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';

const ServiceAvailabilityData = [
    { name: 'Uptime', value: 95 },
    { name: 'Downtime', value: 5 }
];

const COLORS = ['#014086', '#FF8042'];

const ServiceAvailabilityChart = () => (
    <ResponsiveContainer width="100%" height={300}>
        <PieChart>
            <Pie data={ServiceAvailabilityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                {
                    ServiceAvailabilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))
                }
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    </ResponsiveContainer>
);

export default ServiceAvailabilityChart;
