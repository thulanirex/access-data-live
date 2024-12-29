import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { SuccessFailureData } from '@/types/api';

interface TengaSuccessFailureChartProps {
    data: SuccessFailureData[];
}

const COLORS = ['#16a34a', '#dc2626'];

const TengaSuccessFailureChart: React.FC<TengaSuccessFailureChartProps> = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip 
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default TengaSuccessFailureChart;
