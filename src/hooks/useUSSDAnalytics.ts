import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface USSDServiceData {
    failed: number;
    service: string;
    success: number;
    total: number;
}

interface USSDTimeSeriesData {
    timestamp: string;
    total: number;
    success: number;
    failed: number;
    successRate: number;
}

interface USSDApiResponse {
    channel: string;
    detailReport: USSDServiceData[];
    failed: number;
    percentFailed: number;
    percentSuccess: number;
    statusCode: number;
    success: number;
    total: number;
    timeSeriesData?: USSDTimeSeriesData[]; 
}

interface USSDMetrics {
    totalTransactions: number;
    successfulTransactions: number;
    failedTransactions: number;
    successRate: number;
}

interface UseUSSDAnalyticsProps {
    startDate?: string;
    endDate?: string;
}

interface UseUSSDAnalyticsReturn {
    data: {
        metrics: USSDMetrics;
        serviceData: USSDServiceData[];
        timeSeriesData: USSDTimeSeriesData[];
        successRate: number;
    } | null;
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export function useUSSDAnalytics({ startDate, endDate }: UseUSSDAnalyticsProps): UseUSSDAnalyticsReturn {
    const [data, setData] = useState<USSDApiResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            
            const formattedStartDate = startDate ? `${startDate} 00:00:00` : format(new Date(), 'dd-MMM-yyyy 00:00:00').toUpperCase();
            const formattedEndDate = endDate ? `${endDate} 23:59:59` : format(new Date(), 'dd-MMM-yyyy 23:59:59').toUpperCase();

            console.log('Fetching USSD data for:', { formattedStartDate, formattedEndDate });

            const response = await fetch(
                `http://10.160.43.209:5000/api/v1/access_data_analytic/?start_timestamp=${formattedStartDate}&end_timestamp=${formattedEndDate}&channel_name=USSD_801`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();
            console.log('USSD API Response:', responseData);

            const mockTimeSeriesData = generateMockTimeSeriesData(responseData);
            const enrichedData = {
                ...responseData,
                timeSeriesData: mockTimeSeriesData
            };

            setData(enrichedData);
            setError(null);
        } catch (err) {
            console.error('Error fetching USSD data:', err);
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log('Date range changed:', { startDate, endDate });
        fetchData();
        const interval = setInterval(fetchData, 300000); 
        return () => clearInterval(interval);
    }, [startDate, endDate]);

    const transformedData = data ? {
        metrics: {
            totalTransactions: data.total,
            successfulTransactions: data.success,
            failedTransactions: data.failed,
            successRate: data.percentSuccess,
        },
        serviceData: data.detailReport,
        timeSeriesData: data.timeSeriesData || [],
        successRate: data.percentSuccess,
    } : null;

    return {
        data: transformedData,
        isLoading,
        error,
        refetch: fetchData,
    };
}

function generateMockTimeSeriesData(data: USSDApiResponse): USSDTimeSeriesData[] {
    const now = new Date();
    const hourlyData: USSDTimeSeriesData[] = [];
    
    for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now);
        timestamp.setHours(now.getHours() - i);
        
        const total = Math.floor(data.total / 24 * (0.5 + Math.random()));
        const success = Math.floor(total * (data.percentSuccess / 100));
        const failed = total - success;
        
        hourlyData.push({
            timestamp: timestamp.toISOString(),
            total,
            success,
            failed,
            successRate: (success / total) * 100
        });
    }
    
    return hourlyData;
}
