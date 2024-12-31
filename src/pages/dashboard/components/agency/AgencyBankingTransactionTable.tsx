import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface TransactionData {
    FAILED_TRANSACTIONS: number;
    SUCCESSFUL_TRANSACTIONS: number;
    TOTAL_TRANSACTIONS: number;
    TRANSACTION_TYPE: string;
}

interface Props {
    data: TransactionData[];
}

const AgencyBankingTransactionTable: React.FC<Props> = ({ data }) => {
    return (
        <div className="relative w-full overflow-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Transaction Type</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Successful</TableHead>
                        <TableHead className="text-right">Failed</TableHead>
                        <TableHead className="text-right">Success Rate</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row) => {
                        const successRate = (row.SUCCESSFUL_TRANSACTIONS / row.TOTAL_TRANSACTIONS) * 100;
                        return (
                            <TableRow key={row.TRANSACTION_TYPE}>
                                <TableCell>{row.TRANSACTION_TYPE}</TableCell>
                                <TableCell className="text-right">{row.TOTAL_TRANSACTIONS}</TableCell>
                                <TableCell className="text-right">{row.SUCCESSFUL_TRANSACTIONS}</TableCell>
                                <TableCell className="text-right">{row.FAILED_TRANSACTIONS}</TableCell>
                                <TableCell className="text-right">{successRate.toFixed(2)}%</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};

export default AgencyBankingTransactionTable;