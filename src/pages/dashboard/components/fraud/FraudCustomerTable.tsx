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
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download, ArrowUpDown, ExternalLink } from "lucide-react";
import TransactionDetailsModal from './TransactionDetailsModal';

interface CustomerActivity {
    customerId: string;
    customerName: string;
    totalTransactions: number;
    totalAmount: number;
    averageAmount: number;
    lastActivity: string;
    drCrRatio: number;
    riskScore: number;
}

interface TransactionDetailsProps {
    customerId: string;
    customerName: string;
    startDate: string;
    endDate: string;
    flagDetails: string | null;
}

interface FraudCustomerTableProps {
    data: CustomerActivity[];
}

const FraudCustomerTable: React.FC<FraudCustomerTableProps> = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState<keyof CustomerActivity>('riskScore');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [riskFilter, setRiskFilter] = useState('all');
    const [selectedCustomer, setSelectedCustomer] = useState<TransactionDetailsProps | null>(null);
    const [transactionModalOpen, setTransactionModalOpen] = useState(false);
    
    // Get current date in YYYY-MM-DD format
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    
    // Get date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const formattedThirtyDaysAgo = thirtyDaysAgo.toISOString().split('T')[0];

    // Filter data based on search query and risk level
    const filteredData = data.filter(customer => {
        const matchesSearch = searchTerm === '' || 
            customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.customerId.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRisk = riskFilter === 'all' || 
            (riskFilter === 'high' && customer.riskScore >= 70) ||
            (riskFilter === 'medium' && customer.riskScore >= 40 && customer.riskScore < 70) ||
            (riskFilter === 'low' && customer.riskScore < 40);
        
        return matchesSearch && matchesRisk;
    });

    // Sort data
    const sortedData = [...filteredData].sort((a, b) => {
        const fieldA = a[sortBy];
        const fieldB = b[sortBy];
        
        if (typeof fieldA === 'number' && typeof fieldB === 'number') {
            return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
        } else {
            const strA = String(fieldA).toLowerCase();
            const strB = String(fieldB).toLowerCase();
            return sortDirection === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
        }
    });

    // Calculate pagination
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, sortedData.length);
    const paginatedData = sortedData.slice(startIndex, endIndex);

    // Handle sort
    const handleSort = (field: keyof CustomerActivity) => {
        if (field === sortBy) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortDirection('desc'); // Default to descending for new field
        }
    };

    // Handle row click to show transaction details
    const handleRowClick = (customer: CustomerActivity) => {
        // Ensure we pass the full account number without truncation
        const fullAccountNumber = customer.customerId;
        
        // Get the current date for the transaction interval
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const currentHour = String(date.getHours()).padStart(2, '0');
        const currentMinute = String(Math.floor(date.getMinutes() / 30) * 30).padStart(2, '0'); // Round to nearest 30 min interval
        
        // Format as YYYY-MM-DD HH:MM
        const formattedDate = `${year}-${month}-${day} ${currentHour}:${currentMinute}`;
        
        setSelectedCustomer({
            customerId: fullAccountNumber,
            customerName: customer.customerName,
            startDate: formattedDate,
            endDate: formattedDate,
            flagDetails: null
        });
        setTransactionModalOpen(true);
    };

    // Close modal
    const handleCloseModal = () => {
        setTransactionModalOpen(false);
        setSelectedCustomer(null);
    };

    // Get risk level color
    const getRiskColor = (score: number) => {
        if (score >= 70) {
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        } else if (score >= 40) {
            return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
        } else {
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        }
    };

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ZMW',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Export to CSV
    const exportToCSV = () => {
        const headers = ['Customer ID', 'Customer Name', 'Total Transactions', 'Total Amount', 'Average Amount', 'Last Activity', 'DR/CR Ratio', 'Risk Score'];
        const csvData = filteredData.map(customer => [
            customer.customerId,
            customer.customerName,
            customer.totalTransactions.toString(),
            customer.totalAmount.toString(),
            customer.averageAmount.toString(),
            customer.lastActivity,
            customer.drCrRatio.toString(),
            customer.riskScore.toString()
        ]);
        
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `customer_activity_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Sortable header cell component
    const SortableHeader = ({ field, label }: { field: keyof CustomerActivity, label: string }) => (
        <TableHead className="cursor-pointer" onClick={() => handleSort(field)}>
            <div className="flex items-center">
                {label}
                <ArrowUpDown className={`ml-1 h-4 w-4 ${sortBy === field ? 'opacity-100' : 'opacity-50'}`} />
            </div>
        </TableHead>
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm whitespace-nowrap">Risk Level:</span>
                        <Select value={riskFilter} onValueChange={setRiskFilter}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="All Risk Levels" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Levels</SelectItem>
                                <SelectItem value="high">High Risk</SelectItem>
                                <SelectItem value="medium">Medium Risk</SelectItem>
                                <SelectItem value="low">Low Risk</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="relative w-full md:w-64">
                        <Input
                            placeholder="Search customer..."
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
                            <SortableHeader field="totalTransactions" label="Total Transactions" />
                            <SortableHeader field="totalAmount" label="Total Amount" />
                            <SortableHeader field="averageAmount" label="Avg. Amount" />
                            <TableHead>Last Activity</TableHead>
                            <SortableHeader field="drCrRatio" label="DR/CR Ratio" />
                            <SortableHeader field="riskScore" label="Risk Score" />
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((customer, index) => (
                                <TableRow 
                                    key={`${customer.customerId}-${index}`} 
                                    onClick={() => handleRowClick(customer)}
                                    className="cursor-pointer hover:bg-muted/50"
                                >
                                    <TableCell className="font-mono text-xs">{customer.customerId}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <span>{customer.customerName}</span>
                                            <ExternalLink className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0 opacity-50" />
                                        </div>
                                    </TableCell>
                                    <TableCell>{customer.totalTransactions.toLocaleString()}</TableCell>
                                    <TableCell>{formatCurrency(customer.totalAmount)}</TableCell>
                                    <TableCell>{formatCurrency(customer.averageAmount)}</TableCell>
                                    <TableCell>{customer.lastActivity}</TableCell>
                                    <TableCell>{customer.drCrRatio.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(customer.riskScore)}`}>
                                            {customer.riskScore.toFixed(0)}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-4">
                                    No customer data found matching the current filters.
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
            {selectedCustomer && (
                <TransactionDetailsModal
                    isOpen={transactionModalOpen}
                    onClose={handleCloseModal}
                    customerId={selectedCustomer.customerId}
                    customerName={selectedCustomer.customerName}
                    startDate={formattedThirtyDaysAgo}
                    endDate={formattedToday}
                />
            )}
        </div>
    );
};

export default FraudCustomerTable;
