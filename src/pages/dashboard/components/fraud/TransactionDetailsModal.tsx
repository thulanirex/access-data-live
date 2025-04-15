import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, Download, FileText } from "lucide-react";
import { format } from 'date-fns';

export interface TransactionDetail {
    module: string;
    trnRefNo: string;
    eventSrNo: number;
    event: string;
    acEntrySrNo: number;
    acBranch: string;
    acNo: string;
    acCcy: string;
    drcrInd: string;
    trnCode: string;
    amountTag: string;
    fcyAmount: number | null;
    exchRate: number | null;
    lcyAmount: number;
    relatedCustomer: string;
    relatedAccount: string | null;
    relatedReference: string | null;
    trnDt: string;
    valueDt: string;
    txnInitDate: string;
    userId: string;
    txnDtTime: string;
    additionalText: string;
}

interface TransactionDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    customerId: string;
    customerName: string;
    startDate: string;
    endDate: string;
    flagDetails?: string | null;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
    isOpen,
    onClose,
    customerId,
    customerName,
    startDate,
    endDate,
    flagDetails
}) => {
    const [transactions, setTransactions] = useState<TransactionDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('all');
    const [formattedStartDate, setFormattedStartDate] = useState('');
    const [formattedEndDate, setFormattedEndDate] = useState('');

    useEffect(() => {
        if (isOpen && customerId) {
            fetchTransactionDetails();
        }
    }, [isOpen, customerId, startDate, endDate]);

    const fetchTransactionDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            // Extract account number from customerId and ensure it's not truncated
            // The ellipsis character might be different depending on how it's rendered
            const accountNumber = customerId.replace(/…|\.{3}/g, ''); 
            
            console.log('Processing transaction details for account:', accountNumber);
            
            // Parse the transaction interval
            let intervalDate = startDate;
            let intervalTime = '00:00';
            
            // Handle different interval formats
            if (startDate.includes(' ')) {
                // Format: "2025-04-15 06:00"
                const parts = startDate.split(' ');
                intervalDate = parts[0];
                intervalTime = parts[1];
            } else if (startDate.includes('-') && startDate.includes(':')) {
                // Format: "2025-04-15:00"
                intervalDate = startDate.split(':')[0];
                intervalTime = '00:00';
            }
            
            // Ensure we have a valid date and time
            if (!intervalDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
                // If invalid date, use today
                const today = new Date();
                intervalDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            }
            
            // Create properly formatted start date
            const apiStartDate = `${intervalDate} ${intervalTime}:00`;
            
            // Add 30 minutes for the end date
            let [hours, minutes] = intervalTime.split(':').map(part => parseInt(part));
            
            // Simple 30 minute addition
            minutes += 30;
            if (minutes >= 60) {
                minutes -= 60;
                hours += 1;
            }
            if (hours >= 24) {
                hours -= 24;
            }
            
            const apiEndDate = `${intervalDate} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
            
            // Save formatted dates for display
            setFormattedStartDate(apiStartDate);
            setFormattedEndDate(apiEndDate);
            
            // Properly encode the URL parameters
            const encodedStartDate = encodeURIComponent(apiStartDate);
            const encodedEndDate = encodeURIComponent(apiEndDate);
            
            const apiUrl = `http://localhost:8944/api/transactions/account/details?accountNumber=${accountNumber}&startDate=${encodedStartDate}&endDate=${encodedEndDate}`;
            
            console.log('Fetching transaction details from:', apiUrl);
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Check if response is JSON or text
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data: TransactionDetail[] = await response.json();
                setTransactions(data);
            } else {
                // Handle text response (likely "No transactions found")
                const textResponse = await response.text();
                console.log("API returned text response:", textResponse);
                // Set empty array but don't throw an error
                setTransactions([]);
            }
        } catch (err) {
            console.error('Error fetching transaction details:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch transaction details');
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'dd MMM yyyy HH:mm:ss');
        } catch (e) {
            return dateString;
        }
    };

    // Format currency
    const formatCurrency = (amount: number | null) => {
        if (amount === null) return 'N/A';
        return new Intl.NumberFormat('en-ZM', {
            style: 'currency',
            currency: 'ZMW',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Filter transactions based on active tab
    const filteredTransactions = transactions.filter(txn => {
        if (activeTab === 'all') return true;
        if (activeTab === 'debit') return txn.drcrInd === 'D';
        if (activeTab === 'credit') return txn.drcrInd === 'C';
        return true;
    });

    // Calculate transaction statistics
    const totalDebitAmount = transactions
        .filter(txn => txn.drcrInd === 'D')
        .reduce((sum, txn) => sum + (txn.lcyAmount || 0), 0);
    
    const totalCreditAmount = transactions
        .filter(txn => txn.drcrInd === 'C')
        .reduce((sum, txn) => sum + (txn.lcyAmount || 0), 0);
    
    const debitCount = transactions.filter(txn => txn.drcrInd === 'D').length;
    const creditCount = transactions.filter(txn => txn.drcrInd === 'C').length;
    
    // Export to CSV
    const exportToCSV = () => {
        const headers = [
            'Transaction Reference', 
            'Date/Time', 
            'Type', 
            'Amount', 
            'Currency', 
            'Description',
            'User ID',
            'Related Customer'
        ];
        
        const csvData = transactions.map(txn => [
            txn.trnRefNo,
            formatDate(txn.txnDtTime),
            txn.drcrInd === 'D' ? 'Debit' : 'Credit',
            txn.lcyAmount.toString(),
            txn.acCcy,
            txn.additionalText,
            txn.userId,
            txn.relatedCustomer
        ]);
        
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `transactions_${customerId}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Generate PDF report (placeholder function - would need PDF library integration)
    const generatePDFReport = () => {
        alert('PDF report generation would be implemented here with a library like jsPDF');
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span>Transaction Details</span>
                        {flagDetails && (
                            <Badge variant="outline" className="ml-2">
                                Flagged
                            </Badge>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        <div className="flex flex-col gap-1">
                            <p>Customer: <strong>{customerName}</strong> (ID: {customerId})</p>
                            <p>Period: <strong>{formatDate(formattedStartDate)}</strong> to <strong>{formatDate(formattedEndDate)}</strong> (30-minute window)</p>
                            {flagDetails && (
                                <div className="flex items-center mt-2 p-2 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
                                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                                    <span className="text-amber-700 dark:text-amber-300 text-sm">{flagDetails}</span>
                                </div>
                            )}
                        </div>
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <span className="ml-2">Loading transaction details...</span>
                    </div>
                ) : error ? (
                    <div className="p-4 text-red-500 bg-red-50 dark:bg-red-950 rounded-md">
                        Error loading transaction details: {error}
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <FileText className="h-16 w-16 text-muted-foreground mb-4 opacity-30" />
                        <h3 className="text-lg font-medium mb-2">No transactions found</h3>
                        <p className="text-muted-foreground max-w-md">
                            No transaction data is available for account {customerId} during the selected time period ({startDate} to {endDate}).
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-md">
                                <div className="text-sm text-muted-foreground">Total Transactions</div>
                                <div className="text-2xl font-bold">{transactions.length}</div>
                            </div>
                            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-md">
                                <div className="text-sm text-muted-foreground">Credit Transactions</div>
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{creditCount} ({((creditCount / transactions.length) * 100).toFixed(0)}%)</div>
                                <div className="text-sm">{formatCurrency(totalCreditAmount)}</div>
                            </div>
                            <div className="bg-red-50 dark:bg-red-950 p-4 rounded-md">
                                <div className="text-sm text-muted-foreground">Debit Transactions</div>
                                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{debitCount} ({((debitCount / transactions.length) * 100).toFixed(0)}%)</div>
                                <div className="text-sm">{formatCurrency(totalDebitAmount)}</div>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-md">
                                <div className="text-sm text-muted-foreground">Net Flow</div>
                                <div className={`text-2xl font-bold ${totalCreditAmount - totalDebitAmount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {formatCurrency(totalCreditAmount - totalDebitAmount)}
                                </div>
                            </div>
                        </div>

                        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                            <div className="flex justify-between items-center mb-4">
                                <TabsList>
                                    <TabsTrigger value="all">All Transactions</TabsTrigger>
                                    <TabsTrigger value="debit">Debits</TabsTrigger>
                                    <TabsTrigger value="credit">Credits</TabsTrigger>
                                </TabsList>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={exportToCSV}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Export CSV
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={generatePDFReport}>
                                        <FileText className="h-4 w-4 mr-2" />
                                        PDF Report
                                    </Button>
                                </div>
                            </div>

                            <TabsContent value="all" className="mt-0">
                                <div className="border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[180px]">Transaction Ref</TableHead>
                                                <TableHead>Date/Time</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>User ID</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredTransactions.length > 0 ? (
                                                filteredTransactions.map((txn) => (
                                                    <TableRow key={txn.trnRefNo + txn.acEntrySrNo}>
                                                        <TableCell className="font-mono text-xs">{txn.trnRefNo}</TableCell>
                                                        <TableCell>{formatDate(txn.txnDtTime)}</TableCell>
                                                        <TableCell>
                                                            <Badge variant={txn.drcrInd === 'D' ? 'destructive' : 'default'}>
                                                                {txn.drcrInd === 'D' ? 'Debit' : 'Credit'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-right font-medium">
                                                            {formatCurrency(txn.lcyAmount)}
                                                        </TableCell>
                                                        <TableCell className="max-w-[200px] truncate" title={txn.additionalText}>
                                                            {txn.additionalText || 'N/A'}
                                                        </TableCell>
                                                        <TableCell>{txn.userId}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center py-4">
                                                        No transactions found matching the current filter.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                            
                            <TabsContent value="debit" className="mt-0">
                                <div className="border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[180px]">Transaction Ref</TableHead>
                                                <TableHead>Date/Time</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>User ID</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredTransactions.length > 0 ? (
                                                filteredTransactions.map((txn) => (
                                                    <TableRow key={txn.trnRefNo + txn.acEntrySrNo}>
                                                        <TableCell className="font-mono text-xs">{txn.trnRefNo}</TableCell>
                                                        <TableCell>{formatDate(txn.txnDtTime)}</TableCell>
                                                        <TableCell className="text-right font-medium">
                                                            {formatCurrency(txn.lcyAmount)}
                                                        </TableCell>
                                                        <TableCell className="max-w-[200px] truncate" title={txn.additionalText}>
                                                            {txn.additionalText || 'N/A'}
                                                        </TableCell>
                                                        <TableCell>{txn.userId}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-4">
                                                        No debit transactions found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                            
                            <TabsContent value="credit" className="mt-0">
                                <div className="border rounded-md">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[180px]">Transaction Ref</TableHead>
                                                <TableHead>Date/Time</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>User ID</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredTransactions.length > 0 ? (
                                                filteredTransactions.map((txn) => (
                                                    <TableRow key={txn.trnRefNo + txn.acEntrySrNo}>
                                                        <TableCell className="font-mono text-xs">{txn.trnRefNo}</TableCell>
                                                        <TableCell>{formatDate(txn.txnDtTime)}</TableCell>
                                                        <TableCell className="text-right font-medium">
                                                            {formatCurrency(txn.lcyAmount)}
                                                        </TableCell>
                                                        <TableCell className="max-w-[200px] truncate" title={txn.additionalText}>
                                                            {txn.additionalText || 'N/A'}
                                                        </TableCell>
                                                        <TableCell>{txn.userId}</TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="text-center py-4">
                                                        No credit transactions found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TransactionDetailsModal;
