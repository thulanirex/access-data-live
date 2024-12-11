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
import { channelData } from './IncidentData';

const ChannelMetricsTable: React.FC = () => {
    return (
        <Table>
            <TableCaption>Channel Performance Metrics</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-1/4">Channel</TableHead>
                    <TableHead className="w-1/4 text-right">Uptime (%)</TableHead>
                    <TableHead className="w-1/4 text-right">Downtime (%)</TableHead>
                    <TableHead className="w-1/4 text-right">Incidents Reported</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {channelData.map((row, index) => (
                    <TableRow key={index}>
                        <TableCell>{row.channel}</TableCell>
                        <TableCell className="text-right">{row.uptimePercent}%</TableCell>
                        <TableCell className="text-right">{row.downtimePercent}%</TableCell>
                        <TableCell className="text-right">{row.incidentsReported}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default ChannelMetricsTable;
