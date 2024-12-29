import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TransactionTypeMetrics } from "@/types/api";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";

interface MobileTransactionTableProps {
    data: TransactionTypeMetrics[];
}

export default function MobileTransactionTable({ data }: MobileTransactionTableProps) {
    const [searchTerm, setSearchTerm] = useState('');

    // Filter and sort the data
    const filteredData = data
        .filter(t => t.type.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => b.total - a.total);

    return (
        <div className="space-y-4">
            <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
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
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    No transactions found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData.map((item) => (
                                <TableRow key={item.type}>
                                    <TableCell className="font-medium">{item.type}</TableCell>
                                    <TableCell className="text-right">{item.total.toLocaleString()}</TableCell>
                                    <TableCell className="text-right text-green-600">{item.successCount.toLocaleString()}</TableCell>
                                    <TableCell className="text-right text-red-600">{item.failureCount.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">{item.successRate.toFixed(1)}%</TableCell>
                                    <TableCell className="text-right">
                                        {item.successRate >= 90 ? (
                                            <div className="flex items-center justify-end space-x-2">
                                                <span className="text-green-600">Good</span>
                                                <ArrowUpIcon className="h-4 w-4 text-green-600" />
                                            </div>
                                        ) : item.successRate >= 70 ? (
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
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
