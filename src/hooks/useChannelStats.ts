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

  // Collect all analytics data in one place
  const analyticsData = useMemo(() => ({
    accessPay: accessPay.data,
    tengaMetrics: tengaAnalytics.channelMetrics,
    mobileMetrics: mobileAnalytics.channelMetrics,
    nfsData: nfsAnalytics.data,
    ussdData: ussdAnalytics.data
  }), [
    accessPay.data,
    tengaAnalytics.channelMetrics,
    mobileAnalytics.channelMetrics,
    nfsAnalytics.data,
    ussdAnalytics.data
  ]);

  useEffect(() => {
    try {
      const channels: ChannelStatus[] = [];
      let totalTransactions = 0;
      let totalSuccessful = 0;
      let activeChannels = 0;

      // Access Pay
      if (analyticsData.accessPay) {
        const { metrics } = analyticsData.accessPay;
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
      if (analyticsData.tengaMetrics.length > 0) {
        const metrics = analyticsData.tengaMetrics[0];
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
      if (analyticsData.mobileMetrics.length > 0) {
        const metrics = analyticsData.mobileMetrics[0];
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
      if (analyticsData.nfsData?.metrics) {
        const { metrics } = analyticsData.nfsData;
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
      if (analyticsData.ussdData?.metrics) {
        const { metrics } = analyticsData.ussdData;
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

      const overallSuccessRate = totalTransactions > 0 
        ? (totalSuccessful / totalTransactions) * 100 
        : 0;

      setData({
        channels,
        totalTransactions,
        overallSuccessRate,
        activeChannels
      });
      setError(null);
    } catch (err) {
      console.error('Error processing channel stats:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
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
    isLoading: isLoading || 
               accessPay.isLoading || 
               tengaAnalytics.loading || 
               mobileAnalytics.loading || 
               nfsAnalytics.isLoading || 
               ussdAnalytics.isLoading,
    error: error || 
           accessPay.error || 
           tengaAnalytics.error || 
           mobileAnalytics.error || 
           nfsAnalytics.error || 
           ussdAnalytics.error,
    refetch
  };
}