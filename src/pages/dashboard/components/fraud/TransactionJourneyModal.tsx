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
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowRight, ArrowDown } from "lucide-react";
import { format } from 'date-fns';

interface TransactionEntry {
    TRN_REF_NO: string;
    AC_ENTRY_SR_NO: number;
    EVENT_SR_NO: number;
    EVENT: string;
    AC_BRANCH: string;
    AC_NO: string;
    AC_CCY: string;
    CATEGORY: string;
    DRCR_IND: string;
    TRN_CODE: string;
    FCY_AMOUNT: number | null;
    EXCH_RATE: number | null;
    LCY_AMOUNT: number;
    TRN_DT: string;
    VALUE_DT: string;
    TXN_INIT_DATE: string;
    AMOUNT_TAG: string;
    RELATED_ACCOUNT: string | null;
    RELATED_CUSTOMER: string | null;
    RELATED_REFERENCE: string | null;
    USER_ID: string;
    TXN_DT_TIME: string;
    // Add other fields as needed
}

interface TransactionJourneyModalProps {
    isOpen: boolean;
    onClose: () => void;
    referenceNumber: string;
}

const TransactionJourneyModal: React.FC<TransactionJourneyModalProps> = ({
    isOpen,
    onClose,
    referenceNumber
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transactionEntries, setTransactionEntries] = useState<TransactionEntry[]>([]);

    useEffect(() => {
        if (isOpen && referenceNumber) {
            fetchTransactionEntries();
        }
    }, [isOpen, referenceNumber]);

    const fetchTransactionEntries = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const apiUrl = `http://localhost:8944/api/transactions/entries?refNo=${referenceNumber}`;
            console.log('Fetching transaction entries from:', apiUrl);
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            setTransactionEntries(data);
            console.log('Transaction entries loaded:', data);
        } catch (err) {
            console.error('Error fetching transaction entries:', err);
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            if (!dateString) return 'N/A';
            
            // Parse the date string
            const date = new Date(dateString);
            
            // Check if date is valid
            if (isNaN(date.getTime())) return dateString;
            
            // Format the date
            return format(date, 'dd MMM yyyy HH:mm:ss');
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    };

    const formatCurrency = (amount: number | null) => {
        if (amount === null) return 'N/A';
        return new Intl.NumberFormat('en-ZM', {
            style: 'currency',
            currency: 'ZMW',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Group entries by debit and credit
    const debitEntries = transactionEntries.filter(entry => entry.DRCR_IND === 'D');
    const creditEntries = transactionEntries.filter(entry => entry.DRCR_IND === 'C');

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span>Transaction Journey</span>
                        <Badge variant="outline" className="ml-2">
                            {referenceNumber}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>
                        <p>Showing all transaction legs for reference: <strong>{referenceNumber}</strong></p>
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <span className="ml-2">Loading transaction journey...</span>
                    </div>
                ) : error ? (
                    <div className="p-4 text-red-500 bg-red-50 dark:bg-red-950 rounded-md">
                        Error loading transaction entries: {error}
                    </div>
                ) : transactionEntries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
                            <ArrowRight className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No Transaction Entries Found</h3>
                        <p className="text-muted-foreground max-w-md">
                            We couldn't find any transaction entries for reference number {referenceNumber}.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Transaction Flow Visualization */}
                        <div className="bg-muted/30 p-4 rounded-md">
                            <h3 className="font-medium text-lg mb-4">Transaction Flow</h3>
                            <div className="flex flex-col items-center">
                                {debitEntries.map((debitEntry, index) => (
                                    <div key={`debit-${debitEntry.AC_ENTRY_SR_NO}`} className="w-full">
                                        <div className="flex items-center justify-between mb-2 bg-red-50 dark:bg-red-950/30 p-3 rounded-md border border-red-100 dark:border-red-900">
                                            <div>
                                                <p className="font-medium">{debitEntry.AC_NO}</p>
                                                <p className="text-sm text-muted-foreground">Branch: {debitEntry.AC_BRANCH}</p>
                                            </div>
                                            <div>
                                                <Badge variant="destructive">DEBIT</Badge>
                                                <p className="text-right font-bold text-red-600 dark:text-red-400">
                                                    {formatCurrency(debitEntry.LCY_AMOUNT)}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-center my-2">
                                            <ArrowDown className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        
                                        {creditEntries[index] && (
                                            <div className="flex items-center justify-between mb-4 bg-green-50 dark:bg-green-950/30 p-3 rounded-md border border-green-100 dark:border-green-900">
                                                <div>
                                                    <p className="font-medium">{creditEntries[index].AC_NO}</p>
                                                    <p className="text-sm text-muted-foreground">Branch: {creditEntries[index].AC_BRANCH}</p>
                                                </div>
                                                <div>
                                                    <Badge variant="default">CREDIT</Badge>
                                                    <p className="text-right font-bold text-green-600 dark:text-green-400">
                                                        {formatCurrency(creditEntries[index].LCY_AMOUNT)}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Transaction Details Table */}
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Entry #</TableHead>
                                        <TableHead>Account</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Date/Time</TableHead>
                                        <TableHead>User</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transactionEntries.map((entry) => (
                                        <TableRow key={entry.AC_ENTRY_SR_NO}>
                                            <TableCell className="font-mono">{entry.AC_ENTRY_SR_NO}</TableCell>
                                            <TableCell>
                                                <div className="font-medium">{entry.AC_NO}</div>
                                                <div className="text-xs text-muted-foreground">Branch: {entry.AC_BRANCH}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={entry.DRCR_IND === 'D' ? 'destructive' : 'default'}>
                                                    {entry.DRCR_IND === 'D' ? 'Debit' : 'Credit'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className={`font-medium ${entry.DRCR_IND === 'D' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                                {formatCurrency(entry.LCY_AMOUNT)}
                                            </TableCell>
                                            <TableCell>{formatDate(entry.TXN_DT_TIME)}</TableCell>
                                            <TableCell>{entry.USER_ID}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Transaction Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-muted/30 p-4 rounded-md">
                                <h3 className="font-medium text-lg mb-2">Transaction Details</h3>
                                <div className="space-y-2">
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="text-muted-foreground">Reference:</span>
                                        <span className="col-span-2 font-mono">{referenceNumber}</span>
                                    </div>
                                    {transactionEntries.length > 0 && (
                                        <>
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="text-muted-foreground">Module:</span>
                                                <span className="col-span-2">{transactionEntries[0].MODULE}</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="text-muted-foreground">Event:</span>
                                                <span className="col-span-2">{transactionEntries[0].EVENT}</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="text-muted-foreground">Transaction Date:</span>
                                                <span className="col-span-2">{formatDate(transactionEntries[0].TRN_DT)}</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="text-muted-foreground">Value Date:</span>
                                                <span className="col-span-2">{formatDate(transactionEntries[0].VALUE_DT)}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="bg-muted/30 p-4 rounded-md">
                                <h3 className="font-medium text-lg mb-2">Summary</h3>
                                <div className="space-y-2">
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="text-muted-foreground">Total Entries:</span>
                                        <span className="col-span-2">{transactionEntries.length}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="text-muted-foreground">Debit Entries:</span>
                                        <span className="col-span-2">{debitEntries.length}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <span className="text-muted-foreground">Credit Entries:</span>
                                        <span className="col-span-2">{creditEntries.length}</span>
                                    </div>
                                    {transactionEntries.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2">
                                            <span className="text-muted-foreground">Currency:</span>
                                            <span className="col-span-2">{transactionEntries[0].AC_CCY}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TransactionJourneyModal;
