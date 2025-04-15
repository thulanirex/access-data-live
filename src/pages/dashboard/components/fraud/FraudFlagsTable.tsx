import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download, ExternalLink } from "lucide-react";
import TransactionDetailsModal from './TransactionDetailsModal';

interface FraudFlag {
    customerId: string;
    customerName: string;
    transactionInterval: string;
    flagType: 'DR_CR_SAME_INTERVAL' | 'HIGH_FREQUENCY' | 'THRESHOLD_AVOIDANCE' | 'UNUSUAL_RATIO' | 'VOLUME_SPIKE' | 'REPEATED_AMOUNTS';
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    details: string;
}

interface TransactionDetailsProps {
    customerId: string;
    customerName: string;
    startDate: string;
    endDate: string;
    flagDetails: string | null;
}

interface FraudFlagsTableProps {
    data: FraudFlag[];
}

const FraudFlagsTable: React.FC<FraudFlagsTableProps> = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState<keyof FraudFlag>('severity');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [severityFilter, setSeverityFilter] = useState('all');
    const [flagTypeFilter, setFlagTypeFilter] = useState('all');
    const [selectedFlag, setSelectedFlag] = useState<TransactionDetailsProps | null>(null);
    const [transactionModalOpen, setTransactionModalOpen] = useState(false);

    // Filter data based on selected filters and search query
    const filteredData = data.filter(flag => {
        const matchesSeverity = severityFilter === 'all' || flag.severity === severityFilter;
        const matchesFlagType = flagTypeFilter === 'all' || flag.flagType === flagTypeFilter;
        const matchesSearch = searchTerm === '' || 
            flag.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            flag.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            flag.details.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesSeverity && matchesFlagType && matchesSearch;
    });

    // Calculate pagination
    const totalPages = Math.ceil(filteredData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredData.length);
    const paginatedData = filteredData.slice(startIndex, endIndex);

    // Format flag type for display
    const formatFlagType = (type: string) => {
        switch(type) {
            case 'DR_CR_SAME_INTERVAL': return 'DR/CR Reversals';
            case 'HIGH_FREQUENCY': return 'High Frequency';
            case 'THRESHOLD_AVOIDANCE': return 'Threshold Avoidance';
            case 'UNUSUAL_RATIO': return 'Unusual DR/CR Ratio';
            case 'VOLUME_SPIKE': return 'Volume Spike';
            case 'REPEATED_AMOUNTS': return 'Repeated Amounts';
            default: return type;
        }
    };

    // Get severity badge color
    const getSeverityBadge = (severity: string) => {
        switch(severity) {
            case 'HIGH': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'MEDIUM': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
            case 'LOW': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
        }
    };

    // Handle row click to open transaction details
    const handleRowClick = (flag: FraudFlag) => {
        // Use the transaction interval from the flag
        setSelectedFlag({
            customerId: flag.customerId,
            customerName: flag.customerName,
            startDate: flag.transactionInterval,
            endDate: flag.transactionInterval,
            flagDetails: flag.details,
        });
        setTransactionModalOpen(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setTransactionModalOpen(false);
        setSelectedFlag(null);
    };

    // Export to CSV
    const exportToCSV = () => {
        const headers = ['Customer ID', 'Customer Name', 'Transaction Interval', 'Flag Type', 'Severity', 'Details'];
        const csvData = filteredData.map(flag => [
            flag.customerId,
            flag.customerName,
            flag.transactionInterval,
            formatFlagType(flag.flagType),
            flag.severity,
            flag.details
        ]);
        
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `fraud_flags_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm whitespace-nowrap">Severity:</span>
                        <Select value={severityFilter} onValueChange={setSeverityFilter}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="All Severities" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Severities</SelectItem>
                                <SelectItem value="HIGH">High</SelectItem>
                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                <SelectItem value="LOW">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm whitespace-nowrap">Flag Type:</span>
                        <Select value={flagTypeFilter} onValueChange={setFlagTypeFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="All Flag Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Flag Types</SelectItem>
                                <SelectItem value="DR_CR_SAME_INTERVAL">DR/CR Reversals</SelectItem>
                                <SelectItem value="HIGH_FREQUENCY">High Frequency</SelectItem>
                                <SelectItem value="THRESHOLD_AVOIDANCE">Threshold Avoidance</SelectItem>
                                <SelectItem value="UNUSUAL_RATIO">Unusual DR/CR Ratio</SelectItem>
                                <SelectItem value="VOLUME_SPIKE">Volume Spike</SelectItem>
                                <SelectItem value="REPEATED_AMOUNTS">Repeated Amounts</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="relative w-full md:w-64">
                        <Input
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <Button variant="outline" size="icon" onClick={exportToCSV} title="Export to CSV">
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[120px]">Customer ID</TableHead>
                            <TableHead>Customer Name</TableHead>
                            <TableHead className="w-[180px]">Transaction Interval</TableHead>
                            <TableHead className="w-[150px]">Flag Type</TableHead>
                            <TableHead className="w-[100px]">Severity</TableHead>
                            <TableHead>Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((flag, index) => (
                                <TableRow 
                                    key={`${flag.customerId}-${flag.flagType}-${index}`} 
                                    onClick={() => handleRowClick(flag)}
                                    className="cursor-pointer hover:bg-muted/50"
                                >
                                    <TableCell className="font-mono text-xs">{flag.customerId}</TableCell>
                                    <TableCell>{flag.customerName}</TableCell>
                                    <TableCell>{flag.transactionInterval}</TableCell>
                                    <TableCell>
                                        {formatFlagType(flag.flagType)}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityBadge(flag.severity)}`}>
                                            {flag.severity}
                                        </span>
                                    </TableCell>
                                    <TableCell className="max-w-[300px] truncate" title={flag.details}>
                                        <div className="flex items-center justify-between">
                                            <span>{flag.details}</span>
                                            <ExternalLink className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4">
                                    No suspicious activities found matching the current filters.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Showing {filteredData.length > 0 ? startIndex + 1 : 0} to {endIndex} of {filteredData.length} entries
                    </span>
                    <Select value={pageSize.toString()} onValueChange={(value) => {
                        setPageSize(parseInt(value));
                        setCurrentPage(1);
                    }}>
                        <SelectTrigger className="w-[70px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                    </Select>
                    <span className="text-sm text-muted-foreground">per page</span>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm mx-2">
                        Page {currentPage} of {totalPages || 1}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            {selectedFlag && (
                <TransactionDetailsModal
                    isOpen={transactionModalOpen}
                    onClose={handleCloseModal}
                    customerId={selectedFlag.customerId}
                    customerName={selectedFlag.customerName}
                    startDate={selectedFlag.startDate}
                    endDate={selectedFlag.endDate}
                    flagDetails={selectedFlag.flagDetails}
                />
            )}
        </div>
    );
};

export default FraudFlagsTable;
