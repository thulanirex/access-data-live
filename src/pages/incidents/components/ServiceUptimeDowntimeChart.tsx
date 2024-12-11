import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { serviceData } from './IncidentData';


const ServiceUptimeDowntimeChart = () => (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart data={serviceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Percentage', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="uptime" stackId="a" fill="#014086" />
            <Bar dataKey="downtime" stackId="a" fill="#ee7e01" />
        </BarChart>
    </ResponsiveContainer>
);

export default ServiceUptimeDowntimeChart;
