import React from 'react';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { TableData } from './IncidentData';


const DashboardTable: React.FC = () => {
    const tableData: TableData[] = [
    { department: "Digital Channels", openIssues: 120, closedIssues: 300, avgResolutionTime: "24 hours", successRate: "95%", trend: "up" },
    { department: "Enterprise Applications Development & Integrations", openIssues: 75, closedIssues: 150, avgResolutionTime: "36 hours", successRate: "90%", trend: "down" },
    { department: "Infrastructure & Networks", openIssues: 20, closedIssues: 98, avgResolutionTime: "72 hours", successRate: "88%", trend: "up" },
    { department: "ATM / Card Operations", openIssues: 20, closedIssues: 98, avgResolutionTime: "72 hours", successRate: "88%", trend: "up" },
    { department: "Corebanking & Flexcube Support", openIssues: 20, closedIssues: 98, avgResolutionTime: "72 hours", successRate: "88%", trend: "up" },
    ];

    return (
        <Table>
            <TableCaption>Department Performance Metrics</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-1/5">Department</TableHead>
                    <TableHead className="w-1/5 text-right">Open Issues</TableHead>
                    <TableHead className="w-1/5 text-right">Closed Issues</TableHead>
                    <TableHead className="w-1/5 text-right">Avg. Resolution Time</TableHead>
                    <TableHead className="w-1/5 text-right">Success Rate</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {tableData.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell>{row.department}</TableCell>
                        <TableCell className="text-right">{row.openIssues}</TableCell>
                        <TableCell className="text-right">{row.closedIssues}</TableCell>
                        <TableCell className="text-right">{row.avgResolutionTime}</TableCell>
                        <TableCell className="text-right">
                            {row.successRate}
                            <span className={`ml-2 font-bold ${row.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                {row.trend === 'up' ? '↑' : '↓'}
                            </span>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default DashboardTable;
