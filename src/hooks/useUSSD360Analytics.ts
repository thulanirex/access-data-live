import { useState, useEffect } from 'react';
import { USSD360Response } from '@/types/api';

interface UseUSSD360AnalyticsProps {
    startDate: string;
    endDate: string;
}

export function useUSSD360Analytics({ startDate, endDate }: UseUSSD360AnalyticsProps) {
    const [data, setData] = useState<USSD360Response | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(
                `http://10.160.43.209:5000/api/v1/access_data_analytic/?start_timestamp=${startDate}&end_timestamp=${endDate}&channel_name=ussd_360`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch USSD *360# data');
            }

            const jsonData = await response.json();
            setData(jsonData);
            setError(null);
        } catch (err) {
            console.error('Error fetching USSD *360# data:', err);
            setError(err instanceof Error ? err : new Error('Failed to fetch USSD *360# data'));
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