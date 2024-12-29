import { useState, useEffect } from 'react';
import { ApiResponse, SuccessFailureData, ChannelMetrics, TransactionTypeMetrics } from '../types/api';
import { fetchAnalyticsData } from '../services/analyticsService';

interface UseAnalyticsProps {
    startDate: string;
    endDate: string;
    channel?: string;
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
        const channelData = apiData.channelsData.find(ch => 
            channel === 'MOBILE' 
                ? ch.CHANNEL.includes('Mobile Banking')
                : ch.CHANNEL.includes('Tenga Wallet')
        );

        if (!channelData) return [];

        const totalSuccess = channelData.DATA.reduce((acc, curr) => acc + curr.SUCCESS, 0);
        const totalFailed = channelData.DATA.reduce((acc, curr) => acc + curr.FAILED, 0);
        const total = totalSuccess + totalFailed;
        
        const successRate = total > 0 ? (totalSuccess / total) * 100 : 0;
        const failureRate = total > 0 ? (totalFailed / total) * 100 : 0;

        return [
            {
                name: 'Success',
                value: successRate,
                percent: successRate
            },
            {
                name: 'Failure',
                value: failureRate,
                percent: failureRate
            }
        ];
    };

    const calculateChannelMetrics = (apiData: ApiResponse): ChannelMetrics[] => {
        const channelData = apiData.channelsData.find(ch => 
            channel === 'MOBILE' 
                ? ch.CHANNEL.includes('Mobile Banking')
                : ch.CHANNEL.includes('Tenga Wallet')
        );

        if (!channelData) return [];

        const metrics = channelData.DATA.reduce(
            (acc, curr) => {
                acc.successCount += curr.SUCCESS;
                acc.failureCount += curr.FAILED;
                acc.totalTransactions += curr.TOTAL;
                return acc;
            },
            { successCount: 0, failureCount: 0, totalTransactions: 0 }
        );

        return [{
            channel: channelData.CHANNEL,
            ...metrics,
            successRate: metrics.totalTransactions > 0 
                ? (metrics.successCount / metrics.totalTransactions) * 100 
                : 0
        }];
    };

    const getTransactionTypeMetrics = (apiData: ApiResponse): TransactionTypeMetrics[] => {
        const channelData = apiData.channelsData.find(ch => 
            channel === 'MOBILE' 
                ? ch.CHANNEL.includes('Mobile Banking')
                : ch.CHANNEL.includes('Tenga Wallet')
        );

        if (!channelData) return [];

        return channelData.DATA.map(transaction => ({
            type: transaction.FTTYPE,
            channel: channelData.CHANNEL,
            successCount: transaction.SUCCESS,
            failureCount: transaction.FAILED,
            total: transaction.TOTAL,
            successRate: transaction.PERCENT_SUCCESS
        }));
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            // Always use TENGA as channel_name in API call
            const response = await fetchAnalyticsData(startDate, endDate, 'TENGA');
            setData(response);
        } catch (err) {
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
    }, [startDate, endDate, refreshInterval]);

    return {
        loading,
        error,
        successFailureData: data ? transformToSuccessFailureData(data) : [],
        channelMetrics: data ? calculateChannelMetrics(data) : [],
        transactionMetrics: data ? getTransactionTypeMetrics(data) : [],
        refetch: fetchData
    };
};
