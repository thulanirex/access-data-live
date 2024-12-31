import { AgencyBankingResponse } from "@/types/api";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface Props {
    data: AgencyBankingResponse | null;
}

const AgencyBankingSuccessRateChart: React.FC<Props> = ({ data }) => {
    if (!data) return null;

    const chartData = [
        { name: 'Successful', value: data.success },
        { name: 'Failed', value: data.failed }
    ];

    const COLORS = ['#22c55e', '#ef4444'];

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default AgencyBankingSuccessRateChart;