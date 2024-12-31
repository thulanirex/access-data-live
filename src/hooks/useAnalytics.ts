import { useState, useEffect } from 'react';
import { ApiResponse, SuccessFailureData, ChannelMetrics, TransactionTypeMetrics } from '../types/api';

interface UseAnalyticsProps {
    startDate: string;
    endDate: string;
    channel?: 'TENGA' | 'MOBILE';
    refreshInterval?: number;
}

interface UseAnalyticsReturn {
    loading: boolean;
    error: Error | null;
    successFailureData: SuccessFailureData[];
    channelMetrics: ChannelMetrics[];
    transactionMetrics: TransactionTypeMetrics[];
    refetch: () => Promise<void>;
}

export const useAnalytics = ({
    startDate,
    endDate,
    channel = 'TENGA',
    refreshInterval = 300000 // 5 minutes default
}: UseAnalyticsProps): UseAnalyticsReturn => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<ApiResponse | null>(null);

    const transformToSuccessFailureData = (apiData: ApiResponse): SuccessFailureData[] => {
        if (!apiData) return [];
        
        return [
            {
                name: 'Success',
                value: apiData.success,
                percent: apiData.percentSuccess
            },
            {
                name: 'Failure',
                value: apiData.failed,
                percent: apiData.percentFailed
            }
        ];
    };

    const calculateChannelMetrics = (apiData: ApiResponse): ChannelMetrics[] => {
        if (!apiData) return [];

        return [{
            channel: apiData.channel,
            successCount: apiData.success,
            failureCount: apiData.failed,
            totalTransactions: apiData.total,
            successRate: apiData.percentSuccess
        }];
    };

    const getTransactionTypeMetrics = (apiData: ApiResponse): TransactionTypeMetrics[] => {
        if (!apiData?.detailReport) return [];

        return apiData.detailReport.map(transaction => ({
            type: transaction.TRANSACTION_TYPE,
            channel: apiData.channel,
            successCount: transaction.SUCCESSFUL_TRANSACTIONS,
            failureCount: transaction.FAILED_TRANSACTIONS,
            total: transaction.TOTAL_TRANSACTIONS,
            successRate: transaction.TOTAL_TRANSACTIONS > 0 
                ? (transaction.SUCCESSFUL_TRANSACTIONS / transaction.TOTAL_TRANSACTIONS) * 100 
                : 0
        }));
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Map channel names to API parameters
            const channelParam = channel === 'MOBILE' ? 'mobile_banking' : 'tenga';
            
            const response = await fetch(
                `http://10.160.43.209:5000/api/v1/access_data_analytic/?start_timestamp=${startDate}&end_timestamp=${endDate}&channel_name=${channelParam}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const jsonData = await response.json();
            setData(jsonData);
        } catch (err) {
            console.error('Error fetching analytics data:', err);
            setError(err instanceof Error ? err : new Error('Failed to fetch analytics data'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        if (refreshInterval > 0) {
            const interval = setInterval(fetchData, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [startDate, endDate, channel, refreshInterval]);

    return {
        loading,
        error,
        successFailureData: data ? transformToSuccessFailureData(data) : [],
        channelMetrics: data ? calculateChannelMetrics(data) : [],
        transactionMetrics: data ? getTransactionTypeMetrics(data) : [],
        refetch: fetchData
    };
};