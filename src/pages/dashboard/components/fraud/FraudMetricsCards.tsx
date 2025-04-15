import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Activity, Users, BarChart3 } from 'lucide-react';

interface FraudMetricsCardsProps {
    loading: boolean;
    totalFlags: number;
    highRiskFlags: number;
    uniqueCustomersWithFlags: number;
    totalTransactions: number;
}

const FraudMetricsCards: React.FC<FraudMetricsCardsProps> = ({
    loading,
    totalFlags,
    highRiskFlags,
    uniqueCustomersWithFlags,
    totalTransactions
}) => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Flags */}
            <Card>
                <CardContent className="p-6">
                    {loading ? (
                        <div className="h-[90px] w-full animate-pulse rounded-md bg-muted" />
                    ) : (
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900 rounded-full">
                                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-300" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Total Flags
                                </p>
                                <h3 className="text-2xl font-bold">{totalFlags}</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Suspicious activities detected
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* High Risk Flags */}
            <Card>
                <CardContent className="p-6">
                    {loading ? (
                        <div className="h-[90px] w-full animate-pulse rounded-md bg-muted" />
                    ) : (
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-red-100 dark:bg-red-900 rounded-full">
                                <Activity className="h-6 w-6 text-red-600 dark:text-red-300" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    High Risk
                                </p>
                                <h3 className="text-2xl font-bold">{highRiskFlags}</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Critical attention required
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Unique Customers */}
            <Card>
                <CardContent className="p-6">
                    {loading ? (
                        <div className="h-[90px] w-full animate-pulse rounded-md bg-muted" />
                    ) : (
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                                <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Flagged Customers
                                </p>
                                <h3 className="text-2xl font-bold">{uniqueCustomersWithFlags}</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Customers with suspicious activity
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Total Transactions */}
            <Card>
                <CardContent className="p-6">
                    {loading ? (
                        <div className="h-[90px] w-full animate-pulse rounded-md bg-muted" />
                    ) : (
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                                <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-300" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    Transactions Analyzed
                                </p>
                                <h3 className="text-2xl font-bold">{totalTransactions}</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Total transactions in period
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default FraudMetricsCards;
