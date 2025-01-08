import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface AccessPayDetailReport {
    BANK_TYPE_DESCRIPTION: string;
    FAILED_RATE: number;
    FAILED_TRANSACTIONS: number;
    FINALIZED_RATE: number;
    FINALIZED_TRANSACTIONS: number;
    PENDING_RATE: number;
    PENDING_TRANSACTIONS: number;
    STATUS_DESCRIPTION: string;
    TRANSACTION_COUNT: number;
}

interface AccessPayApiResponse {
    channel: string;
    detailReport: AccessPayDetailReport[];
    statusCode: number;
    timestamp: string;
}

interface ProcessedData {
    metrics: {
        [x: string]: any;
        totalTransactions: number;
        successfulTransactions: number;
        failedTransactions: number;
        pendingTransactions: number;
        successRate: number;
    };
    serviceData: {
        description: string;
        count: number;
        status: string;
    }[];
    statusData: {
        status: string;
        count: number;
    }[];
}

interface UseAccessPayAnalyticsProps {
    startDate?: Date;
    endDate?: Date;
}

export function useAccessPayAnalytics({ startDate, endDate }: UseAccessPayAnalyticsProps = {}) {
    const [data, setData] = useState<ProcessedData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const formatDateForApi = (date: Date) => {
        return format(date, 'dd-MMM-yyyy').toUpperCase();
    };

    const processData = (apiResponse: AccessPayApiResponse): ProcessedData => {
        // Calculate totals
        const totalTransactions = apiResponse.detailReport.reduce((sum, item) => 
            sum + item.TRANSACTION_COUNT, 0);
        const failedTransactions = apiResponse.detailReport.reduce((sum, item) => 
            sum + item.FAILED_TRANSACTIONS, 0);
        const finalizedTransactions = apiResponse.detailReport.reduce((sum, item) => 
            sum + item.FINALIZED_TRANSACTIONS, 0);
        const pendingTransactions = apiResponse.detailReport.reduce((sum, item) => 
            sum + item.PENDING_TRANSACTIONS, 0);

        // Calculate success rate
        const successRate = totalTransactions > 0 
            ? (finalizedTransactions / totalTransactions) * 100 
            : 0;

        // Process bank type distribution
        const bankTypeMap = new Map<string, number>();
        apiResponse.detailReport.forEach(item => {
            const current = bankTypeMap.get(item.BANK_TYPE_DESCRIPTION) || 0;
            bankTypeMap.set(item.BANK_TYPE_DESCRIPTION, current + item.TRANSACTION_COUNT);
        });

        const serviceData = Array.from(bankTypeMap.entries()).map(([description, count]) => ({
            description,
            count,
            status: 'total'
        }));

        // Process status distribution
        const statusMap = new Map<string, number>();
        apiResponse.detailReport.forEach(item => {
            const current = statusMap.get(item.STATUS_DESCRIPTION) || 0;
            statusMap.set(item.STATUS_DESCRIPTION, current + item.TRANSACTION_COUNT);
        });

        const statusData = Array.from(statusMap.entries()).map(([status, count]) => ({
            status,
            count
        }));

        return {
            metrics: {
                totalTransactions,
                successfulTransactions: finalizedTransactions,
                failedTransactions,
                pendingTransactions,
                successRate
            },
            serviceData,
            statusData: statusData.sort((a, b) => b.count - a.count)
        };
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);
            
            const now = new Date();
            const actualStartDate = startDate || now;
            const actualEndDate = endDate || now;

            const formattedStartDate = formatDateForApi(actualStartDate);
            const formattedEndDate = formatDateForApi(actualEndDate);

           
            console.log('Fetching AccessPay data with dates:', { formattedStartDate, formattedEndDate });

            const url = `http://10.160.43.209:5000/api/v1/access_data_analytic/?start_timestamp=${formattedStartDate}&end_timestamp=${formattedEndDate}&channel_name=accesspay`;

            const response = await fetch(url);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || 'Failed to fetch Access Pay data');
            }

            const apiResponse: AccessPayApiResponse = await response.json();
            const processedData = processData(apiResponse);
            setData(processedData);
            setError(null);
        } catch (err) {
            console.error('Error fetching Access Pay data:', err);
            setError(err instanceof Error ? err : new Error('Failed to fetch data'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
        return () => clearInterval(interval);
    }, [startDate, endDate]);

    return {
        data,
        isLoading,
        error,
        refetch: fetchData
    };
}