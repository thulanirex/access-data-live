import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw, Info } from "lucide-react";
import { CustomerTransaction } from '@/hooks/useFraudAnalytics';

interface ValidationRule {
    id: string;
    name: string;
    description: string;
    validate: (data: CustomerTransaction[]) => {
        passed: boolean;
        score: number;
        details: string;
    };
}

interface FraudDataValidationProps {
    data: CustomerTransaction[];
    onRefresh: () => void;
    isRefreshing: boolean;
}

const FraudDataValidation: React.FC<FraudDataValidationProps> = ({ 
    data, 
    onRefresh,
    isRefreshing
}) => {
    const [validationResults, setValidationResults] = useState<{
        overallScore: number;
        rules: {
            id: string;
            name: string;
            passed: boolean;
            score: number;
            details: string;
        }[];
    }>({
        overallScore: 0,
        rules: []
    });

    // Define validation rules
    const validationRules: ValidationRule[] = [
        {
            id: 'data-completeness',
            name: 'Data Completeness',
            description: 'Checks if all required fields are present in the data',
            validate: (data) => {
                if (!data || data.length === 0) {
                    return { 
                        passed: false, 
                        score: 0,
                        details: 'No data available for validation' 
                    };
                }

                const requiredFields = ['CUSTOMER_ID', 'CUSTOMER_NAME', 'TRANSACTION_INTERVAL', 'TRANSACTION_COUNT', 'TOTAL_AMOUNT_IN_INTERVAL', 'DRCR_IND'];
                const missingFields: string[] = [];
                
                // Check first record for missing fields
                const firstRecord = data[0];
                requiredFields.forEach(field => {
                    if (!(field in firstRecord)) {
                        missingFields.push(field);
                    }
                });

                // Check for null values in critical fields
                let nullValueCount = 0;
                let totalFieldCount = 0;
                
                data.forEach(record => {
                    requiredFields.forEach(field => {
                        if (field in record) {
                            totalFieldCount++;
                            if (record[field as keyof CustomerTransaction] === null || 
                                record[field as keyof CustomerTransaction] === undefined) {
                                nullValueCount++;
                            }
                        }
                    });
                });

                const nullPercentage = totalFieldCount > 0 ? (nullValueCount / totalFieldCount) * 100 : 0;
                
                if (missingFields.length > 0) {
                    return { 
                        passed: false, 
                        score: 0,
                        details: `Missing required fields: ${missingFields.join(', ')}` 
                    };
                } else if (nullPercentage > 10) {
                    return { 
                        passed: false, 
                        score: 50,
                        details: `${nullPercentage.toFixed(1)}% of critical fields contain null values` 
                    };
                } else if (nullPercentage > 0) {
                    return { 
                        passed: true, 
                        score: 80,
                        details: `${nullPercentage.toFixed(1)}% of critical fields contain null values` 
                    };
                } else {
                    return { 
                        passed: true, 
                        score: 100,
                        details: 'All required fields are present and populated' 
                    };
                }
            }
        },
        {
            id: 'data-volume',
            name: 'Data Volume',
            description: 'Checks if there is sufficient data for meaningful analysis',
            validate: (data) => {
                if (!data) {
                    return { 
                        passed: false, 
                        score: 0,
                        details: 'No data available for validation' 
                    };
                }

                const transactionCount = data.length;
                
                if (transactionCount < 10) {
                    return { 
                        passed: false, 
                        score: Math.min(transactionCount * 10, 50),
                        details: `Only ${transactionCount} transactions available, which is insufficient for reliable fraud detection` 
                    };
                } else if (transactionCount < 50) {
                    return { 
                        passed: true, 
                        score: 70,
                        details: `${transactionCount} transactions available, which is minimal for fraud detection` 
                    };
                } else {
                    return { 
                        passed: true, 
                        score: 100,
                        details: `${transactionCount} transactions available, which is sufficient for reliable fraud detection` 
                    };
                }
            }
        },
        {
            id: 'transaction-distribution',
            name: 'Transaction Distribution',
            description: 'Checks if there is a good distribution of transaction types',
            validate: (data) => {
                if (!data || data.length === 0) {
                    return { 
                        passed: false, 
                        score: 0,
                        details: 'No data available for validation' 
                    };
                }

                const debitCount = data.filter(t => t.DRCR_IND === 'D').length;
                const creditCount = data.filter(t => t.DRCR_IND === 'C').length;
                const totalCount = data.length;
                
                const debitPercentage = (debitCount / totalCount) * 100;
                const creditPercentage = (creditCount / totalCount) * 100;
                
                // Check if one type dominates too much (more than 90%)
                if (debitPercentage > 90 || creditPercentage > 90) {
                    return { 
                        passed: false, 
                        score: 50,
                        details: `Imbalanced transaction types: ${debitPercentage.toFixed(1)}% debits, ${creditPercentage.toFixed(1)}% credits` 
                    };
                } else if (debitPercentage > 80 || creditPercentage > 80) {
                    return { 
                        passed: true, 
                        score: 70,
                        details: `Somewhat imbalanced transaction types: ${debitPercentage.toFixed(1)}% debits, ${creditPercentage.toFixed(1)}% credits` 
                    };
                } else {
                    return { 
                        passed: true, 
                        score: 100,
                        details: `Well-balanced transaction types: ${debitPercentage.toFixed(1)}% debits, ${creditPercentage.toFixed(1)}% credits` 
                    };
                }
            }
        },
        {
            id: 'time-coverage',
            name: 'Time Coverage',
            description: 'Checks if the data covers a sufficient time period',
            validate: (data) => {
                if (!data || data.length === 0) {
                    return { 
                        passed: false, 
                        score: 0,
                        details: 'No data available for validation' 
                    };
                }

                // Get unique intervals
                const uniqueIntervals = new Set(data.map(t => t.TRANSACTION_INTERVAL));
                const intervalCount = uniqueIntervals.size;
                
                if (intervalCount < 3) {
                    return { 
                        passed: false, 
                        score: 30,
                        details: `Only ${intervalCount} time intervals covered, which is insufficient for pattern detection` 
                    };
                } else if (intervalCount < 8) {
                    return { 
                        passed: true, 
                        score: 70,
                        details: `${intervalCount} time intervals covered, which is minimal for pattern detection` 
                    };
                } else {
                    return { 
                        passed: true, 
                        score: 100,
                        details: `${intervalCount} time intervals covered, which is good for pattern detection` 
                    };
                }
            }
        },
        {
            id: 'customer-diversity',
            name: 'Customer Diversity',
            description: 'Checks if there is a diverse set of customers in the data',
            validate: (data) => {
                if (!data || data.length === 0) {
                    return { 
                        passed: false, 
                        score: 0,
                        details: 'No data available for validation' 
                    };
                }

                // Get unique customers
                const uniqueCustomers = new Set(data.map(t => t.CUSTOMER_ID));
                const customerCount = uniqueCustomers.size;
                
                if (customerCount < 3) {
                    return { 
                        passed: false, 
                        score: Math.min(customerCount * 20, 40),
                        details: `Only ${customerCount} unique customers, which limits fraud pattern detection` 
                    };
                } else if (customerCount < 10) {
                    return { 
                        passed: true, 
                        score: 70,
                        details: `${customerCount} unique customers, which is minimal for fraud pattern detection` 
                    };
                } else {
                    return { 
                        passed: true, 
                        score: 100,
                        details: `${customerCount} unique customers, which is good for fraud pattern detection` 
                    };
                }
            }
        }
    ];

    useEffect(() => {
        if (data && data.length > 0) {
            validateData();
        }
    }, [data]);

    const validateData = () => {
        const results = validationRules.map(rule => {
            const result = rule.validate(data);
            return {
                id: rule.id,
                name: rule.name,
                passed: result.passed,
                score: result.score,
                details: result.details
            };
        });

        // Calculate overall score (average of all rule scores)
        const overallScore = results.reduce((sum, rule) => sum + rule.score, 0) / results.length;

        setValidationResults({
            overallScore,
            rules: results
        });
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-500';
        if (score >= 60) return 'text-amber-500';
        return 'text-red-500';
    };

    const getScoreProgressColor = (score: number) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-amber-500';
        return 'bg-red-500';
    };

    const getStatusIcon = (passed: boolean, score: number) => {
        if (passed && score >= 80) {
            return <CheckCircle2 className="h-5 w-5 text-green-500" />;
        } else if (passed) {
            return <AlertTriangle className="h-5 w-5 text-amber-500" />;
        } else {
            return <XCircle className="h-5 w-5 text-red-500" />;
        }
    };

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Data Quality Validation</CardTitle>
                        <CardDescription>
                            Verification of data quality for fraud analytics
                        </CardDescription>
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={onRefresh}
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Validate
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <div className="text-sm font-medium">Overall Data Quality Score</div>
                        <div className={`text-xl font-bold ${getScoreColor(validationResults.overallScore)}`}>
                            {validationResults.overallScore.toFixed(0)}%
                        </div>
                    </div>
                    <Progress 
                        value={validationResults.overallScore} 
                        className={`h-2 ${getScoreProgressColor(validationResults.overallScore)}`} 
                    />
                    
                    {validationResults.overallScore < 60 && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Data Quality Warning</AlertTitle>
                            <AlertDescription>
                                The data quality is insufficient for reliable fraud detection. Results may be inaccurate.
                            </AlertDescription>
                        </Alert>
                    )}
                    
                    {validationResults.overallScore >= 60 && validationResults.overallScore < 80 && (
                        <Alert variant="default" className="mt-4 border-amber-500">
                            <Info className="h-4 w-4 text-amber-500" />
                            <AlertTitle className="text-amber-500">Data Quality Notice</AlertTitle>
                            <AlertDescription>
                                The data quality is acceptable but could be improved for more reliable fraud detection.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>
                
                <div className="space-y-4">
                    {validationResults.rules.map(rule => (
                        <div key={rule.id} className="flex items-start gap-3 border-b pb-3">
                            {getStatusIcon(rule.passed, rule.score)}
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <div className="font-medium">{rule.name}</div>
                                    <Badge variant={rule.passed ? 'outline' : 'destructive'}>
                                        {rule.passed ? 'Passed' : 'Failed'}
                                    </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">{rule.details}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default FraudDataValidation;
