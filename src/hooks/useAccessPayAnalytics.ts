// src/hooks/useAccessPayAnalytics.ts
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface AccessPayServiceData {
    status: string;
    description: string;
    count: number;
}

interface AccessPayApiResponse {
    channel: string;
    detailReport: [string, string, number][];
    failed: number;
    percentFailed: number;
    percentSuccess: number;
    statusCode: number;
    success: number;
    total: number;
}

interface AccessPayMetrics {
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    successRate: number;
}

export function useAccessPayAnalytics(startDate?: string, endDate?: string) {
    const [data, setData] = useState<AccessPayApiResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            
            const formattedStartDate = startDate ? `${startDate} 00:00:00` : format(new Date(), 'dd-MMM-yyyy 00:00:00').toUpperCase();
            const formattedEndDate = endDate ? `${endDate} 23:59:59` : format(new Date(), 'dd-MMM-yyyy 23:59:59').toUpperCase();

            const response = await fetch(
                `http://10.160.43.209:5000/api/v1/access_data_analytic/?start_timestamp=${formattedStartDate}&end_timestamp=${formattedEndDate}&channel_name=ACCESSPAY`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch Access Pay data');
            }

            const responseData = await response.json();
            setData(responseData);
            setError(null);
        } catch (err) {
            console.error('Error fetching Access Pay data:', err);
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 300000);
        return () => clearInterval(interval);
    }, [startDate, endDate]);

    const processedData = data ? {
        metrics: {
            totalTransactions: data.total,
            successfulTransactions: data.success,
            failedTransactions: data.total - data.success,
            successRate: data.percentSuccess,
        },
        serviceData: data.detailReport.map(([status, description, count]) => ({
            status,
            description,
            count,
        })),
    } : null;

    return {
        data: processedData,
        isLoading,
        error,
        refetch: fetchData,
    };
}