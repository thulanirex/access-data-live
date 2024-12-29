import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';

interface NFSApiResponse {
    channel: string;
    detailReport: {
        [key: string]: {
            COMPLETED: number;
            FAILED: number;
            PENDING: number;
            percentFailed: number;
            percentSuccess: number;
            total: number;
        };
    };
    failed: number;
    percentFailed: number;
    percentSuccess: number;
    success: number;
    total: number;
}

interface NFSMetrics {
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    successRate: number;
}

interface NFSTransactionType {
    name: string;
    completed: number;
    failed: number;
    pending: number;
    total: number;
}

interface UseNFSAnalyticsProps {
    startDate?: string;
    endDate?: string;
}

interface UseNFSAnalyticsReturn {
    data: {
        metrics: NFSMetrics;
        transactionTypes: NFSTransactionType[];
        successRate: { timestamp: string; rate: number }[];
    } | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useNFSAnalytics({ startDate, endDate }: UseNFSAnalyticsProps): UseNFSAnalyticsReturn {
    const [currentData, setCurrentData] = useState<NFSApiResponse | null>(null);
    const [trendData, setTrendData] = useState<{ [key: string]: NFSApiResponse } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchDataForDateRange = async (start: string, end: string) => {
        console.log('Fetching data for range:', { start, end });
        
        const response = await fetch(
            `http://10.160.43.209:5000/api/v1/access_data_analytic/?start_timestamp=${start}&end_timestamp=${end}&channel_name=NFS`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        return data;
    };

    const fetchTrendData = async (endDateStr: string) => {
        const endDate = new Date(endDateStr.split('-').reverse().join('-'));
        const startTrendDate = subDays(endDate, 5);
        const dates: string[] = [];
        
        for (let i = 0; i <= 5; i++) {
            const date = new Date(startTrendDate);
            date.setDate(startTrendDate.getDate() + i);
            dates.push(format(date, 'dd-MMM-yyyy').toUpperCase());
        }

        console.log('Fetching trend data for dates:', dates);

        const results = await Promise.all(
            dates.map(async (date) => {
                const result = await fetchDataForDateRange(date, date);
                return result;
            })
        );

        return dates.reduce((acc, date, index) => {
            acc[format(new Date(date.split('-').reverse().join('-')), 'yyyy-MM-dd')] = results[index];
            return acc;
        }, {} as { [key: string]: NFSApiResponse });
    };

    const fetchData = async () => {
        try {
            setIsLoading(true);
            
            // Use provided dates or default to today
            const targetEndDate = endDate || format(new Date(), 'dd-MMM-yyyy').toUpperCase();
            const targetStartDate = startDate || targetEndDate;

            // Fetch main data
            const mainData = await fetchDataForDateRange(targetStartDate, targetEndDate);
            console.log('Main data fetched:', mainData);
            setCurrentData(mainData);

            // Fetch trend data
            const trendDataResult = await fetchTrendData(targetEndDate);
            console.log('Trend data fetched:', trendDataResult);
            setTrendData(trendDataResult);

            setError(null);
        } catch (err) {
            console.error('Error fetching NFS data:', err);
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log('Date range changed:', { startDate, endDate });
        fetchData();
        const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
        return () => clearInterval(interval);
    }, [startDate, endDate]);

    const transformedData = currentData && trendData ? {
        metrics: {
            totalTransactions: currentData.total,
            successfulTransactions: currentData.success,
            failedTransactions: currentData.failed,
            successRate: currentData.percentSuccess,
        },
        transactionTypes: currentData.detailReport ? 
            Object.entries(currentData.detailReport).map(([name, stats]) => ({
                name,
                completed: stats.COMPLETED,
                failed: stats.FAILED,
                pending: stats.PENDING,
                total: stats.total,
            })) : [],
        successRate: Object.entries(trendData)
            .map(([date, dayData]) => ({
                timestamp: date,
                rate: dayData.percentSuccess,
            }))
            .sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
    } : null;

    return {
        data: transformedData,
        isLoading,
        error,
        refetch: fetchData,
    };
}
