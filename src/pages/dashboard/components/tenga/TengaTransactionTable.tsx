import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TransactionTypeMetrics } from "@/types/api";
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";

interface TengaTransactionTableProps {
    data: TransactionTypeMetrics[];
}

export default function TengaTransactionTable({ data }: TengaTransactionTableProps) {
    // Filter and sort wallet transactions
    const walletTransactions = data
        .filter(t => t.type.toLowerCase().includes('wallet'))
        .sort((a, b) => b.total - a.total);

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Transaction Type</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Success</TableHead>
                        <TableHead className="text-right">Failed</TableHead>
                        <TableHead className="text-right">Success Rate</TableHead>
                        <TableHead className="text-right">Trend</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {walletTransactions.map((transaction) => (
                        <TableRow key={transaction.type}>
                            <TableCell className="font-medium">
                                {transaction.type.replace('WALLET', '').trim()}
                            </TableCell>
                            <TableCell className="text-right">
                                {transaction.total.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right text-green-600">
                                {transaction.successCount.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right text-red-600">
                                {transaction.failureCount.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                                {transaction.successRate.toFixed(1)}%
                            </TableCell>
                            <TableCell className="text-right">
                                {transaction.successRate >= 90 ? (
                                    <div className="flex items-center justify-end space-x-2">
                                        <span className="text-green-600">Good</span>
                                        <ArrowUpIcon className="h-4 w-4 text-green-600" />
                                    </div>
                                ) : transaction.successRate >= 70 ? (
                                    <div className="flex items-center justify-end space-x-2">
                                        <span className="text-yellow-600">Fair</span>
                                        <ArrowUpIcon className="h-4 w-4 text-yellow-600" />
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-end space-x-2">
                                        <span className="text-red-600">Poor</span>
                                        <ArrowDownIcon className="h-4 w-4 text-red-600" />
                                    </div>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
