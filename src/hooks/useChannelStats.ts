import { useState, useEffect, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { useAccessPayAnalytics } from './useAccessPayAnalytics';
import { useAnalytics } from './useAnalytics';
import { useNFSAnalytics } from './useNFSAnalytics';
import { useUSSDAnalytics } from './useUSSDAnalytics';

export interface ChannelStatus {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'down';
  successRate: number;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  lastUpdated: string;
}

export interface ChannelStatsResponse {
  channels: ChannelStatus[];
  totalTransactions: number;
  overallSuccessRate: number;
  activeChannels: number;
}

export function useChannelStats() {
  const [data, setData] = useState<ChannelStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const today = useMemo(() => format(new Date(), 'dd-MMM-yyyy').toUpperCase(), []);

  const accessPay = useAccessPayAnalytics(today, today);
  const tengaAnalytics = useAnalytics({
    startDate: today,
    endDate: today,
    channel: 'TENGA'
  });
  const mobileAnalytics = useAnalytics({
    startDate: today,
    endDate: today,
    channel: 'MOBILE'
  });
  const nfsAnalytics = useNFSAnalytics({ startDate: today, endDate: today });
  const ussdAnalytics = useUSSDAnalytics({ startDate: today, endDate: today });

  // Collect all analytics data in one place, with error handling
  const analyticsData = useMemo(() => ({
    accessPay: {
      data: accessPay.data,
      error: accessPay.error,
      isLoading: accessPay.isLoading
    },
    tenga: {
      data: tengaAnalytics.channelMetrics,
      error: tengaAnalytics.error,
      isLoading: tengaAnalytics.loading
    },
    mobile: {
      data: mobileAnalytics.channelMetrics,
      error: mobileAnalytics.error,
      isLoading: mobileAnalytics.loading
    },
    nfs: {
      data: nfsAnalytics.data,
      error: nfsAnalytics.error,
      isLoading: nfsAnalytics.isLoading
    },
    ussd: {
      data: ussdAnalytics.data,
      error: ussdAnalytics.error,
      isLoading: ussdAnalytics.isLoading
    }
  }), [
    accessPay.data, accessPay.error, accessPay.isLoading,
    tengaAnalytics.channelMetrics, tengaAnalytics.error, tengaAnalytics.loading,
    mobileAnalytics.channelMetrics, mobileAnalytics.error, mobileAnalytics.loading,
    nfsAnalytics.data, nfsAnalytics.error, nfsAnalytics.isLoading,
    ussdAnalytics.data, ussdAnalytics.error, ussdAnalytics.isLoading
  ]);

  useEffect(() => {
    try {
      const channels: ChannelStatus[] = [];
      let totalTransactions = 0;
      let totalSuccessful = 0;
      let activeChannels = 0;

      // Access Pay
      if (!analyticsData.accessPay.error && analyticsData.accessPay.data) {
        const { metrics } = analyticsData.accessPay.data;
        channels.push({
          id: 'accesspay',
          name: 'Access Pay',
          status: metrics.successRate >= 90 ? 'operational' : metrics.successRate >= 70 ? 'degraded' : 'down',
          successRate: metrics.successRate,
          totalTransactions: metrics.totalTransactions,
          successfulTransactions: metrics.successfulTransactions,
          failedTransactions: metrics.failedTransactions,
          lastUpdated: new Date().toISOString()
        });
        totalTransactions += metrics.totalTransactions;
        totalSuccessful += metrics.successfulTransactions;
        activeChannels++;
      }

      // Tenga
      if (!analyticsData.tenga.error && analyticsData.tenga.data.length > 0) {
        const metrics = analyticsData.tenga.data[0];
        channels.push({
          id: 'tenga',
          name: 'Tenga',
          status: metrics.successRate >= 90 ? 'operational' : metrics.successRate >= 70 ? 'degraded' : 'down',
          successRate: metrics.successRate,
          totalTransactions: metrics.totalTransactions,
          successfulTransactions: metrics.successCount,
          failedTransactions: metrics.totalTransactions - metrics.successCount,
          lastUpdated: new Date().toISOString()
        });
        totalTransactions += metrics.totalTransactions;
        totalSuccessful += metrics.successCount;
        activeChannels++;
      }

      // Mobile Banking
      if (!analyticsData.mobile.error && analyticsData.mobile.data.length > 0) {
        const metrics = analyticsData.mobile.data[0];
        channels.push({
          id: 'mobile',
          name: 'Mobile Banking',
          status: metrics.successRate >= 90 ? 'operational' : metrics.successRate >= 70 ? 'degraded' : 'down',
          successRate: metrics.successRate,
          totalTransactions: metrics.totalTransactions,
          successfulTransactions: metrics.successCount,
          failedTransactions: metrics.totalTransactions - metrics.successCount,
          lastUpdated: new Date().toISOString()
        });
        totalTransactions += metrics.totalTransactions;
        totalSuccessful += metrics.successCount;
        activeChannels++;
      }

      // NFS
      if (!analyticsData.nfs.error && analyticsData.nfs.data?.metrics) {
        const { metrics } = analyticsData.nfs.data;
        channels.push({
          id: 'nfs',
          name: 'NFS',
          status: metrics.successRate >= 90 ? 'operational' : metrics.successRate >= 70 ? 'degraded' : 'down',
          successRate: metrics.successRate,
          totalTransactions: metrics.totalTransactions,
          successfulTransactions: metrics.successfulTransactions,
          failedTransactions: metrics.failedTransactions,
          lastUpdated: new Date().toISOString()
        });
        totalTransactions += metrics.totalTransactions;
        totalSuccessful += metrics.successfulTransactions;
        activeChannels++;
      }

      // USSD
      if (!analyticsData.ussd.error && analyticsData.ussd.data?.metrics) {
        const { metrics } = analyticsData.ussd.data;
        channels.push({
          id: 'ussd',
          name: 'USSD *801#',
          status: metrics.successRate >= 90 ? 'operational' : metrics.successRate >= 70 ? 'degraded' : 'down',
          successRate: metrics.successRate,
          totalTransactions: metrics.totalTransactions,
          successfulTransactions: metrics.successfulTransactions,
          failedTransactions: metrics.failedTransactions,
          lastUpdated: new Date().toISOString()
        });
        totalTransactions += metrics.totalTransactions;
        totalSuccessful += metrics.successfulTransactions;
        activeChannels++;
      }

      //USSD 202

      //ATM

      // Only set error if ALL services failed
      const allServicesFailed = Object.values(analyticsData).every(service => service.error);
      if (allServicesFailed) {
        setError(new Error('All services are currently unavailable'));
      } else {
        setError(null);
      }

      // Set data even if some services failed
      if (channels.length > 0) {
        const overallSuccessRate = totalTransactions > 0 
          ? (totalSuccessful / totalTransactions) * 100 
          : 0;

        setData({
          channels,
          totalTransactions,
          overallSuccessRate,
          activeChannels
        });
      }
    } catch (err) {
      console.error('Error processing channel stats:', err);
      setError(err as Error);
    } finally {
      // Only consider loading complete when all non-errored services are done loading
      const isStillLoading = Object.values(analyticsData)
        .filter(service => !service.error)
        .some(service => service.isLoading);
      
      setIsLoading(isStillLoading);
    }
  }, [analyticsData]);

  const refetch = useCallback(() => {
    accessPay.refetch();
    tengaAnalytics.refetch();
    mobileAnalytics.refetch();
    nfsAnalytics.refetch();
    ussdAnalytics.refetch();
  }, []);

  return {
    data,
    isLoading: Object.values(analyticsData).every(service => service.isLoading),
    error: Object.values(analyticsData).every(service => service.error) ? error : null,
    refetch
  };
}