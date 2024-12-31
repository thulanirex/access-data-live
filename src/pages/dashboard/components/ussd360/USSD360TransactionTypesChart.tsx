import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TransactionData {
    FAILED_TRANSACTIONS: number;
    SUCCESSFUL_TRANSACTIONS: number;
    TOTAL_TRANSACTIONS: number;
    TRANSACTION_TYPE: string;
}

interface Props {
    data: TransactionData[];
}

const USSD360TransactionTypesChart: React.FC<Props> = ({ data }) => {
    const chartData = data.map(item => ({
        name: item.TRANSACTION_TYPE,
        Successful: item.SUCCESSFUL_TRANSACTIONS,
        Failed: item.FAILED_TRANSACTIONS,
        Total: item.TOTAL_TRANSACTIONS,
    }));

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={chartData}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 100
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Successful" fill="#22c55e" />
                <Bar dataKey="Failed" fill="#ef4444" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default USSD360TransactionTypesChart;