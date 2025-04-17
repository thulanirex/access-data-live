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
import { Loader2, User, CreditCard, Smartphone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import MobileProfileTab, { MobileProfile } from './MobileProfileTab';

interface CustomerAccount {
    CIF_ID: string;
    SIG_TEXT: string;
    BRANCH_CODE: string;
    CUST_AC_NO: string;
    AC_DESC: string;
    CUST_NO: string;
    CCY: string;
    ACCOUNT_CLASS: string;
    AC_OPEN_DATE: string;
    JOINT_AC_INDICATOR: string;
    RECORD_STAT: string;
    ADDRESS1: string;
    ADDRESS2: string;
    ADDRESS3: string;
    ADDRESS4: string | null;
    COUNTRY_CODE: string;
}

interface Customer360ModalProps {
    isOpen: boolean;
    onClose: () => void;
    accountNumber: string;
}

const Customer360Modal: React.FC<Customer360ModalProps> = ({
    isOpen,
    onClose,
    accountNumber
}) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [customerData, setCustomerData] = useState<CustomerAccount[]>([]);
    const [mobileProfile, setMobileProfile] = useState<MobileProfile | null>(null);
    const [mobileProfileLoading, setMobileProfileLoading] = useState(false);
    const [mobileProfileError, setMobileProfileError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        if (isOpen && accountNumber) {
            fetchCustomerDetails();
        }
    }, [isOpen, accountNumber]);

    useEffect(() => {
        if (isOpen && customerData.length > 0) {
            // Once we have customer data, fetch mobile profile using CIF_ID
            fetchMobileProfile(customerData[0].CIF_ID);
        }
    }, [isOpen, customerData]);

    const fetchCustomerDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Clean the account number (remove any ellipsis)
            const cleanAccountNumber = accountNumber.replace(/…|\.\.\./g, '');
            
            const apiUrl = `http://localhost:8944/api/accounts/signature-details?accountNo=${cleanAccountNumber}`;
            console.log('Fetching customer details from:', apiUrl);
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            setCustomerData(data);
            console.log('Customer data loaded:', data);
        } catch (err) {
            console.error('Error fetching customer details:', err);
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    const fetchMobileProfile = async (cifId: string) => {
        try {
            setMobileProfileLoading(true);
            setMobileProfileError(null);
            
            const apiUrl = `http://localhost:8944/api/customers/mobile-profile?cif=${cifId}`;
            console.log('Fetching mobile profile from:', apiUrl);
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }
            
            const data = await response.json();
            setMobileProfile(data);
            console.log('Mobile profile loaded:', data);
        } catch (err) {
            console.error('Error fetching mobile profile:', err);
            setMobileProfileError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setMobileProfileLoading(false);
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
            return format(date, 'dd MMM yyyy');
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    };

    // Get unique customer info (first account's data)
    const primaryAccount = customerData.length > 0 ? customerData[0] : null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span>Customer 360° View</span>
                        <Badge variant="outline" className="ml-2">
                            {primaryAccount?.CUST_NO || 'Loading...'}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription>
                        {primaryAccount ? (
                            <div className="flex flex-col gap-1">
                                <p>Customer: <strong>{primaryAccount.AC_DESC.split('-')[0].trim()}</strong></p>
                                <p>CIF ID: <strong>{primaryAccount.CIF_ID}</strong></p>
                            </div>
                        ) : loading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Loading customer information...</span>
                            </div>
                        ) : (
                            <span>No customer information available</span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                {error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-600 dark:text-red-400">
                        <p className="font-medium">Error loading customer data</p>
                        <p className="text-sm">{error}</p>
                    </div>
                ) : loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                        <p className="text-muted-foreground">Loading customer information...</p>
                    </div>
                ) : customerData.length > 0 ? (
                    <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-4 mb-4">
                            <TabsTrigger value="profile">
                                <User className="h-4 w-4 mr-2" />
                                Profile
                            </TabsTrigger>
                            <TabsTrigger value="accounts">
                                <CreditCard className="h-4 w-4 mr-2" />
                                Accounts ({customerData.length})
                            </TabsTrigger>
                            <TabsTrigger value="signature">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2">
                                    <path d="M4 22h16"></path>
                                    <path d="M4 12h16"></path>
                                    <path d="M10 6l4 6"></path>
                                    <path d="M8 18l4-6"></path>
                                    <path d="M16 18l-4-6"></path>
                                </svg>
                                Signature
                            </TabsTrigger>
                            <TabsTrigger value="mobile">
                                <Smartphone className="h-4 w-4 mr-2" />
                                Mobile Banking
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="bg-muted/30 p-4 rounded-md">
                                        <h3 className="font-medium text-lg mb-2">Personal Information</h3>
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="text-muted-foreground">Customer Name:</span>
                                                <span className="col-span-2 font-medium">{primaryAccount.AC_DESC.split('-')[0].trim()}</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="text-muted-foreground">CIF ID:</span>
                                                <span className="col-span-2">{primaryAccount.CIF_ID}</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="text-muted-foreground">Customer Number:</span>
                                                <span className="col-span-2">{primaryAccount.CUST_NO}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-muted/30 p-4 rounded-md">
                                        <h3 className="font-medium text-lg mb-2">Contact Information</h3>
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="text-muted-foreground">Address Line 1:</span>
                                                <span className="col-span-2">{primaryAccount.ADDRESS1}</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="text-muted-foreground">Address Line 2:</span>
                                                <span className="col-span-2">{primaryAccount.ADDRESS2}</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="text-muted-foreground">Address Line 3:</span>
                                                <span className="col-span-2">{primaryAccount.ADDRESS3}</span>
                                            </div>
                                            {primaryAccount.ADDRESS4 && (
                                                <div className="grid grid-cols-3 gap-2">
                                                    <span className="text-muted-foreground">Address Line 4:</span>
                                                    <span className="col-span-2">{primaryAccount.ADDRESS4}</span>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="text-muted-foreground">Country:</span>
                                                <span className="col-span-2">{primaryAccount.COUNTRY_CODE}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-muted/30 p-4 rounded-md">
                                        <h3 className="font-medium text-lg mb-2">Primary Account</h3>
                                        <div className="space-y-2">
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="text-muted-foreground">Account Number:</span>
                                                <span className="col-span-2 font-mono">{primaryAccount.CUST_AC_NO}</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="text-muted-foreground">Account Description:</span>
                                                <span className="col-span-2">{primaryAccount.AC_DESC}</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="text-muted-foreground">Currency:</span>
                                                <span className="col-span-2">{primaryAccount.CCY}</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="text-muted-foreground">Account Class:</span>
                                                <span className="col-span-2">{primaryAccount.ACCOUNT_CLASS}</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="text-muted-foreground">Branch Code:</span>
                                                <span className="col-span-2">{primaryAccount.BRANCH_CODE}</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="text-muted-foreground">Open Date:</span>
                                                <span className="col-span-2">{formatDate(primaryAccount.AC_OPEN_DATE)}</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="text-muted-foreground">Joint Account:</span>
                                                <span className="col-span-2">{primaryAccount.JOINT_AC_INDICATOR === 'S' ? 'No' : 'Yes'}</span>
                                            </div>
                                            <div className="grid grid-cols-3 gap-2">
                                                <span className="text-muted-foreground">Status:</span>
                                                <span className="col-span-2">
                                                    <Badge variant={primaryAccount.RECORD_STAT === 'O' ? 'default' : 'destructive'}>
                                                        {primaryAccount.RECORD_STAT === 'O' ? 'Active' : 'Closed'}
                                                    </Badge>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-muted/30 p-4 rounded-md">
                                        <h3 className="font-medium text-lg mb-2">Customer Photo</h3>
                                        <div className="flex justify-center">
                                            {primaryAccount.SIG_TEXT ? (
                                                <div className="border rounded-md overflow-hidden w-40 h-40">
                                                    <img 
                                                        src={`data:image/jpeg;base64,${primaryAccount.SIG_TEXT}`} 
                                                        alt="Customer Signature" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center w-40 h-40 bg-muted rounded-md">
                                                    <span className="text-muted-foreground">No photo available</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="accounts">
                            <div className="border rounded-md">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Account Number</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Currency</TableHead>
                                            <TableHead>Open Date</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customerData.map((account) => (
                                            <TableRow key={account.CUST_AC_NO}>
                                                <TableCell className="font-mono">{account.CUST_AC_NO}</TableCell>
                                                <TableCell>{account.AC_DESC}</TableCell>
                                                <TableCell>{account.CCY}</TableCell>
                                                <TableCell>{formatDate(account.AC_OPEN_DATE)}</TableCell>
                                                <TableCell>
                                                    <Badge variant={account.RECORD_STAT === 'O' ? 'default' : 'destructive'}>
                                                        {account.RECORD_STAT === 'O' ? 'Active' : 'Closed'}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TabsContent>

                        <TabsContent value="signature">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {customerData.map((account) => (
                                        <div key={account.CUST_AC_NO} className="border rounded-md p-4">
                                            <div className="mb-2">
                                                <h3 className="font-medium">{account.CUST_AC_NO}</h3>
                                                <p className="text-sm text-muted-foreground">{account.AC_DESC}</p>
                                            </div>
                                            <div className="border rounded-md overflow-hidden aspect-square">
                                                {account.SIG_TEXT ? (
                                                    <img 
                                                        src={`data:image/jpeg;base64,${account.SIG_TEXT}`} 
                                                        alt={`Signature for ${account.CUST_AC_NO}`} 
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center w-full h-full bg-muted">
                                                        <span className="text-muted-foreground">No signature available</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="mobile">
                            <MobileProfileTab 
                                mobileProfile={mobileProfile}
                                loading={mobileProfileLoading}
                                error={mobileProfileError}
                            />
                        </TabsContent>
                    </Tabs>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
                            <User className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">No Customer Data Found</h3>
                        <p className="text-muted-foreground max-w-md">
                            We couldn't find any customer information for account number {accountNumber}.
                        </p>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default Customer360Modal;
