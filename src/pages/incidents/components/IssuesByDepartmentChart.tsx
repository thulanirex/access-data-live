import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

import { issuesByDepartmentData } from './IncidentData';

const IssuesByDepartmentChart = () => (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart data={issuesByDepartmentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="open" fill="#8884d8" />
            <Bar dataKey="closed" fill="#82ca9d" />
        </BarChart>
    </ResponsiveContainer>
);

export default IssuesByDepartmentChart;
