import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface ATMDetailReport {
    failed_transactions: string;
    success_transaction: string;
    total_transactions: string;
}

interface ATMApiResponse {
    channel: string;
    detailReport: ATMDetailReport[];
    message: string;
    percentFailed: string;
    percentSuccess: string;
    statusCode: number;
    total: string;
}

interface UseATMAnalyticsProps {
    startDate: string;
    endDate: string;
}

export function useATMAnalytics({ startDate, endDate }: UseATMAnalyticsProps) {
    const [data, setData] = useState<ATMApiResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(
                `http://10.160.43.209:5000/api/v1/access_data_analytic/?start_timestamp=${startDate}&end_timestamp=${endDate}&channel_name=atm`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch ATM data');
            }

            const jsonData = await response.json();
            setData(jsonData);
            setError(null);
        } catch (err) {
            console.error('Error fetching ATM data:', err);
            setError(err instanceof Error ? err : new Error('Failed to fetch ATM data'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
        return () => clearInterval(interval);
    }, [startDate, endDate]);

    // Transform the data to match the expected format
    const transformedData = data ? {
        channel: data.channel,
        success: parseInt(data.detailReport[0]?.success_transaction || '0'),
        failed: parseInt(data.detailReport[0]?.failed_transactions || '0'),
        total: parseInt(data.total),
        percentSuccess: parseFloat(data.percentSuccess.replace('%', '')),
        percentFailed: parseFloat(data.percentFailed.replace('%', '')),
    } : null;

    return {
        data: transformedData,
        isLoading,
        error,
        refetch: fetchData
    };
}