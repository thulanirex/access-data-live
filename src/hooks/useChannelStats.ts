import { useState, useEffect, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { useAccessPayAnalytics } from './useAccessPayAnalytics';
import { useAnalytics } from './useAnalytics';
import { useNFSAnalytics } from './useNFSAnalytics';
import { useUSSDAnalytics } from './useUSSDAnalytics';
import { useUSSD202Analytics } from './useUSSD202Analytics';
import { useRIBAnalytics } from './useRIBAnalytics';
import { useATMAnalytics } from './useATMAnalytics';
import { useAgencyBankingAnalytics } from './useAgencyBankingAnalytics';
import { useUSSD360Analytics } from './useUSSD360Analytics';

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
//   const accessDate = useMemo(() => new Date(), []);

//   const accessPay = useAccessPayAnalytics({
//     startDate: accessDate,
//     endDate: accessDate
// });
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
  const ussd202Analytics = useUSSD202Analytics({ startDate: today, endDate: today });
  const ribAnalytics = useRIBAnalytics({ startDate: today, endDate: today });
  const atmAnalytics = useATMAnalytics({ startDate: today, endDate: today });
  const agencyBanking = useAgencyBankingAnalytics({ startDate: today, endDate: today }); 
  const ussd360Analytics = useUSSD360Analytics({ startDate: today, endDate: today });
  // Collect all analytics data in one place, with error handling
  const analyticsData = useMemo(() => ({
    // accessPay: {
    //   data: accessPay.data,
    //   error: accessPay.error,
    //   isLoading: accessPay.isLoading
    // },
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
    },
    ussd202: {
      data: ussd202Analytics.data,
      error: ussd202Analytics.error,
      isLoading: ussd202Analytics.isLoading
    },
    rib: {
      data: ribAnalytics.data,
      error: ribAnalytics.error,
      isLoading: ribAnalytics.isLoading
    },
    atm: {
      data: atmAnalytics.data,
      error: atmAnalytics.error,
      isLoading: atmAnalytics.isLoading
    },
    agencyBanking: {
      data: agencyBanking.data,
      error: agencyBanking.error,
      isLoading: agencyBanking.isLoading
    },
    ussd360: {
      data: ussd360Analytics.data,
      error: ussd360Analytics.error,
      isLoading: ussd360Analytics.isLoading
    }
  }), [
    // accessPay.data, accessPay.error, accessPay.isLoading,
    tengaAnalytics.channelMetrics, tengaAnalytics.error, tengaAnalytics.loading,
    mobileAnalytics.channelMetrics, mobileAnalytics.error, mobileAnalytics.loading,
    nfsAnalytics.data, nfsAnalytics.error, nfsAnalytics.isLoading,
    ussdAnalytics.data, ussdAnalytics.error, ussdAnalytics.isLoading,
    ussd202Analytics.data, ussd202Analytics.error, ussd202Analytics.isLoading,
    ribAnalytics.data, ribAnalytics.error, ribAnalytics.isLoading,
    atmAnalytics.data, atmAnalytics.error, atmAnalytics.isLoading,
    agencyBanking.data, agencyBanking.error, agencyBanking.isLoading,
    ussd360Analytics.data, ussd360Analytics.error, ussd360Analytics.isLoading
  ]);

  useEffect(() => {
    try {
      const channels: ChannelStatus[] = [];
      let totalTransactions = 0;
      let totalSuccessful = 0;
      let activeChannels = 0;
 
// if (!accessPay.error) {
//   const detailReport = accessPay.data.serviceData;
//   console.log('AccessPay Detail Report:', detailReport); // Debug log
//   const metrics = accessPay.data.metrics;
//   console.log('AccessPay Metrics:', metrics); // Debug log

//   // Calculate totals from detail report
//   const accessPayMetrics = Array.isArray(metrics) ? metrics.reduce((acc, item) => {
//       // Debug log for each item
//       console.timeLog('processing single item');
//       console.log('Processing item:', {
//           bankType: item.BANK_TYPE_DESCRIPTION,
//           status: item.STATUS_DESCRIPTION,
//           total: item.TRANSACTION_COUNT,
//           finalized: item.FINALIZED_TRANSACTIONS,
//           failed: item.FAILED_TRANSACTIONS,
//           pending: item.PENDING_TRANSACTIONS
//       });

//       return {
//           total: acc.total + Number(item.TRANSACTION_COUNT),
//           finalized: acc.finalized + Number(item.FINALIZED_TRANSACTIONS),
//           failed: acc.failed + Number(item.FAILED_TRANSACTIONS),
//           pending: acc.pending + Number(item.PENDING_TRANSACTIONS)
//       };
//   }, { total: 0, finalized: 0, failed: 0, pending: 0 }) : { total: 0, finalized: 0, failed: 0, pending: 0 };;

//   console.log('AccessPay Metrics Calculated:', accessPayMetrics); // Debug log

//   // Calculate success rate (considering all transactions)
//   const successRate = accessPayMetrics.total > 0 
//       ? (accessPayMetrics.finalized / accessPayMetrics.total) * 100 
//       : 0;

//   console.log('AccessPay Success Rate:', successRate); // Debug log

//   channels.push({
//       id: 'accesspay',
//       name: 'Access Pay',
//       status: getChannelStatus(successRate),
//       successRate: Number(successRate.toFixed(2)),
//       totalTransactions: accessPayMetrics.total,
//       successfulTransactions: accessPayMetrics.finalized,
//       failedTransactions: accessPayMetrics.failed,
//       lastUpdated: new Date().toISOString()
//   });

//   // Update global totals
//   totalTransactions += accessPayMetrics.total;
//   totalSuccessful += accessPayMetrics.finalized;
//   activeChannels++;

//   console.log('AccessPay Channel Data:', channels[channels.length - 1]); // Debug log
// }

// ... rest of the code ...
       
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
          id: 'mobile_banking',
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

     //Retail Internet Banking
      if (!analyticsData.rib.error && analyticsData.rib.data) {
        channels.push({
          id: 'rib',
          name: 'Retail Internet Banking',
          status: analyticsData.rib.data.percentSuccess >= 90 
            ? 'operational' 
            : analyticsData.rib.data.percentSuccess >= 70 
              ? 'degraded' 
              : 'down',
          successRate: analyticsData.rib.data.percentSuccess,
          totalTransactions: analyticsData.rib.data.total,
          successfulTransactions: analyticsData.rib.data.success,
          failedTransactions: analyticsData.rib.data.failed,
          lastUpdated: new Date().toISOString()
        });
        totalTransactions += analyticsData.rib.data.total;
        totalSuccessful += analyticsData.rib.data.success;
        activeChannels++;
      }
     
      //ATM 
      if (!atmAnalytics.error && atmAnalytics.data) {
        channels.push({
            id: 'atm',
            name: 'ATM',
            status: getChannelStatus(atmAnalytics.data.percentSuccess),
            successRate: atmAnalytics.data.percentSuccess,
            totalTransactions: atmAnalytics.data.total,
            successfulTransactions: atmAnalytics.data.success,
            failedTransactions: atmAnalytics.data.failed,
            lastUpdated: new Date().toISOString()
        });
        totalTransactions += atmAnalytics.data.total;

        totalSuccessful += atmAnalytics.data.success;
        activeChannels++;
    }

    //Agency Banking
    if (!agencyBanking.error && agencyBanking.data) {
        channels.push({
            id: 'agency_banking',
            name: 'Agency Banking',
            status: getChannelStatus(agencyBanking.data.percentSuccess),
            successRate: agencyBanking.data.percentSuccess,
            totalTransactions: agencyBanking.data.total,
            successfulTransactions: agencyBanking.data.success,
            failedTransactions: agencyBanking.data.failed,
            lastUpdated: new Date().toISOString()
        });
        totalTransactions += agencyBanking.data.total;
        totalSuccessful += agencyBanking.data.success;
        activeChannels++;
    }

    //USSD 360
    if (!ussd360Analytics.error && ussd360Analytics.data) {
        channels.push({
            id: 'ussd360',
            name: 'USSD *360#',
            status: getChannelStatus(ussd360Analytics.data.percentSuccess),
            successRate: ussd360Analytics.data.percentSuccess,
            totalTransactions: ussd360Analytics.data.total,
            successfulTransactions: ussd360Analytics.data.success,
            failedTransactions: ussd360Analytics.data.failed,
            lastUpdated: new Date().toISOString()
        });
        totalTransactions += ussd360Analytics.data.total;
        totalSuccessful += ussd360Analytics.data.success;
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

      // USSD 202
      if (!analyticsData.ussd202.error && analyticsData.ussd202.data) {
        channels.push({
          id: 'ussd202',
          name: 'USSD *202#',
          status: analyticsData.ussd202.data.percentSuccess >= 90 
            ? 'operational' 
            : analyticsData.ussd202.data.percentSuccess >= 70 
              ? 'degraded' 
              : 'down',
          successRate: analyticsData.ussd202.data.percentSuccess,
          totalTransactions: analyticsData.ussd202.data.total,
          successfulTransactions: analyticsData.ussd202.data.success,
          failedTransactions: analyticsData.ussd202.data.failed,
          lastUpdated: new Date().toISOString()
        });
        totalTransactions += analyticsData.ussd202.data.total;
        totalSuccessful += analyticsData.ussd202.data.success;
        activeChannels++;
      }

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
    // accessPay.refetch();
    tengaAnalytics.refetch();
    mobileAnalytics.refetch();
    nfsAnalytics.refetch();
    ussdAnalytics.refetch();
    ussd202Analytics.refetch();
    ribAnalytics.refetch();
    atmAnalytics.refetch();
    agencyBanking.refetch();
  }, [
    // accessPay.refetch,
    tengaAnalytics.refetch,
    mobileAnalytics.refetch,
    nfsAnalytics.refetch,
    ussdAnalytics.refetch,
    ussd202Analytics.refetch,
    ribAnalytics.refetch,
    atmAnalytics.refetch,
    agencyBanking.refetch
  ]);

  return {
    data,
    isLoading: Object.values(analyticsData).every(service => service.isLoading),
    error: Object.values(analyticsData).every(service => service.error) ? error : null,
    refetch
  };

  function getChannelStatus(successRate: number): 'operational' | 'degraded' | 'down' {
    if (successRate >= 90) return 'operational';
    if (successRate >= 70) return 'degraded';
    return 'down';
}

}