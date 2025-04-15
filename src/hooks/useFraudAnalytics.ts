import { useState, useEffect } from 'react';

// Define interfaces for the fraud analytics data
export interface CustomerTransaction {
  CUSTOMER_ID: string;
  CUSTOMER_NAME: string;
  TRANSACTION_INTERVAL: string;
  TRANSACTION_COUNT: number;
  TOTAL_AMOUNT_IN_INTERVAL: number;
  LAST_TRANSACTION_IN_INTERVAL: string | null;
  DRCR_IND: 'D' | 'C';
}

export interface FraudFlag {
  customerId: string;
  customerName: string;
  transactionInterval: string;
  flagType: 'DR_CR_SAME_INTERVAL' | 'HIGH_FREQUENCY' | 'THRESHOLD_AVOIDANCE' | 'UNUSUAL_RATIO' | 'VOLUME_SPIKE' | 'REPEATED_AMOUNTS';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  details: string;
}

export interface CustomerActivity {
  customerId: string;
  customerName: string;
  totalTransactions: number;
  totalAmount: number;
  averageAmount: number;
  lastActivity: string;
  drCrRatio: number;
  riskScore: number;
}

export interface FraudAnalyticsData {
  transactions: CustomerTransaction[];
  flags: FraudFlag[];
  transactionsByInterval: {
    interval: string;
    debitCount: number;
    creditCount: number;
    totalAmount: number;
  }[];
  drCrDistribution: {
    type: 'Debit' | 'Credit';
    count: number;
    amount: number;
  }[];
  customerActivity: CustomerActivity[];
  amountTrends: {
    interval: string;
    amount: number;
    count: number;
  }[];
  top10CustomersByVolume: {
    customerId: string;
    customerName: string;
    totalAmount: number;
    transactionCount: number;
  }[];
  customerHeatmapData: {
    customerId: string;
    customerName: string;
    intervals: {
      [key: string]: number;
    };
  }[];
}

interface UseFraudAnalyticsProps {
  startDate: string;
  endDate: string;
  refreshInterval?: number;
  highFrequencyThreshold?: number;
  thresholdAmount?: number;
}

export function useFraudAnalytics({
  startDate,
  endDate,
  refreshInterval = 300000, // 5 minutes default
  highFrequencyThreshold = 5,
  thresholdAmount = 95000
}: UseFraudAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<CustomerTransaction[]>([]);
  const [processedData, setProcessedData] = useState<FraudAnalyticsData>({
    transactions: [],
    flags: [],
    transactionsByInterval: [],
    drCrDistribution: [
      { type: 'Debit', count: 0, amount: 0 },
      { type: 'Credit', count: 0, amount: 0 }
    ],
    customerActivity: [],
    amountTrends: [],
    top10CustomersByVolume: [],
    customerHeatmapData: []
  });

  // Function to detect fraud patterns
  const detectFraudPatterns = (transactions: CustomerTransaction[]): FraudAnalyticsData => {
    const flags: FraudFlag[] = [];
    const transactionsByInterval: { [key: string]: { debitCount: number; creditCount: number; totalAmount: number } } = {};
    const customerTransactions: { [key: string]: CustomerTransaction[] } = {};
    const customerActivity: { [key: string]: CustomerActivity } = {};
    const amountTrends: { [key: string]: { amount: number; count: number } } = {};
    const top10CustomersByVolume: { [key: string]: { customerId: string; customerName: string; totalAmount: number; transactionCount: number } } = {};
    const customerHeatmapData: { [key: string]: { customerId: string; customerName: string; intervals: { [key: string]: number } } } = {};
    
    let totalDebitCount = 0;
    let totalCreditCount = 0;
    let totalDebitAmount = 0;
    let totalCreditAmount = 0;

    // Track previous interval amounts for volume spike detection
    const intervalAmounts: { [key: string]: number } = {};
    
    // Track repeated amounts per customer
    const customerAmounts: { [key: string]: { [amount: number]: number } } = {};

    // Group transactions by customer and interval
    transactions.forEach(transaction => {
      // Update transaction counts by type
      if (transaction.DRCR_IND === 'D') {
        totalDebitCount++;
        totalDebitAmount += transaction.TOTAL_AMOUNT_IN_INTERVAL;
      } else {
        totalCreditCount++;
        totalCreditAmount += transaction.TOTAL_AMOUNT_IN_INTERVAL;
      }

      // Group by interval
      if (!transactionsByInterval[transaction.TRANSACTION_INTERVAL]) {
        transactionsByInterval[transaction.TRANSACTION_INTERVAL] = {
          debitCount: 0,
          creditCount: 0,
          totalAmount: 0
        };
      }
      
      if (transaction.DRCR_IND === 'D') {
        transactionsByInterval[transaction.TRANSACTION_INTERVAL].debitCount += transaction.TRANSACTION_COUNT;
      } else {
        transactionsByInterval[transaction.TRANSACTION_INTERVAL].creditCount += transaction.TRANSACTION_COUNT;
      }
      
      transactionsByInterval[transaction.TRANSACTION_INTERVAL].totalAmount += transaction.TOTAL_AMOUNT_IN_INTERVAL;

      // Track interval amounts for volume spike detection
      if (!intervalAmounts[transaction.TRANSACTION_INTERVAL]) {
        intervalAmounts[transaction.TRANSACTION_INTERVAL] = 0;
      }
      intervalAmounts[transaction.TRANSACTION_INTERVAL] += transaction.TOTAL_AMOUNT_IN_INTERVAL;

      // Group by customer
      const key = `${transaction.CUSTOMER_ID}_${transaction.TRANSACTION_INTERVAL}`;
      if (!customerTransactions[key]) {
        customerTransactions[key] = [];
      }
      customerTransactions[key].push(transaction);

      // Track repeated amounts per customer
      if (!customerAmounts[transaction.CUSTOMER_ID]) {
        customerAmounts[transaction.CUSTOMER_ID] = {};
      }
      if (!customerAmounts[transaction.CUSTOMER_ID][transaction.TOTAL_AMOUNT_IN_INTERVAL]) {
        customerAmounts[transaction.CUSTOMER_ID][transaction.TOTAL_AMOUNT_IN_INTERVAL] = 0;
      }
      customerAmounts[transaction.CUSTOMER_ID][transaction.TOTAL_AMOUNT_IN_INTERVAL]++;

      // Update customer activity
      if (!customerActivity[transaction.CUSTOMER_ID]) {
        customerActivity[transaction.CUSTOMER_ID] = {
          customerId: transaction.CUSTOMER_ID,
          customerName: transaction.CUSTOMER_NAME,
          totalTransactions: 0,
          totalAmount: 0,
          averageAmount: 0,
          lastActivity: '',
          drCrRatio: 0,
          riskScore: 0
        };
      }
      
      customerActivity[transaction.CUSTOMER_ID].totalTransactions += transaction.TRANSACTION_COUNT;
      customerActivity[transaction.CUSTOMER_ID].totalAmount += transaction.TOTAL_AMOUNT_IN_INTERVAL;
      
      if (transaction.DRCR_IND === 'D') {
        customerActivity[transaction.CUSTOMER_ID].drCrRatio += transaction.TOTAL_AMOUNT_IN_INTERVAL;
      } else {
        customerActivity[transaction.CUSTOMER_ID].drCrRatio -= transaction.TOTAL_AMOUNT_IN_INTERVAL;
      }

      // Update amount trends
      if (!amountTrends[transaction.TRANSACTION_INTERVAL]) {
        amountTrends[transaction.TRANSACTION_INTERVAL] = {
          amount: 0,
          count: 0
        };
      }
      amountTrends[transaction.TRANSACTION_INTERVAL].amount += transaction.TOTAL_AMOUNT_IN_INTERVAL;
      amountTrends[transaction.TRANSACTION_INTERVAL].count += transaction.TRANSACTION_COUNT;

      // Update top 10 customers by volume
      if (!top10CustomersByVolume[transaction.CUSTOMER_ID]) {
        top10CustomersByVolume[transaction.CUSTOMER_ID] = {
          customerId: transaction.CUSTOMER_ID,
          customerName: transaction.CUSTOMER_NAME,
          totalAmount: 0,
          transactionCount: 0
        };
      }
      top10CustomersByVolume[transaction.CUSTOMER_ID].totalAmount += transaction.TOTAL_AMOUNT_IN_INTERVAL;
      top10CustomersByVolume[transaction.CUSTOMER_ID].transactionCount += transaction.TRANSACTION_COUNT;

      // Update customer heatmap data
      if (!customerHeatmapData[transaction.CUSTOMER_ID]) {
        customerHeatmapData[transaction.CUSTOMER_ID] = {
          customerId: transaction.CUSTOMER_ID,
          customerName: transaction.CUSTOMER_NAME,
          intervals: {}
        };
      }
      if (!customerHeatmapData[transaction.CUSTOMER_ID].intervals[transaction.TRANSACTION_INTERVAL]) {
        customerHeatmapData[transaction.CUSTOMER_ID].intervals[transaction.TRANSACTION_INTERVAL] = 0;
      }
      customerHeatmapData[transaction.CUSTOMER_ID].intervals[transaction.TRANSACTION_INTERVAL] += transaction.TRANSACTION_COUNT;
    });

    // Process customer activity data to calculate averages and risk scores
    Object.values(customerActivity).forEach(customer => {
      // Calculate average amount
      customer.averageAmount = customer.totalAmount / customer.totalTransactions;
      
      // Set last activity time from the latest transaction
      const customerTxns = customerTransactions[customer.customerId] || [];
      if (customerTxns.length > 0) {
        // Find the latest transaction by comparing LAST_TRANSACTION_IN_INTERVAL
        const latestTxn = customerTxns.reduce((latest, current) => {
          if (!latest.LAST_TRANSACTION_IN_INTERVAL) return current;
          if (!current.LAST_TRANSACTION_IN_INTERVAL) return latest;
          return new Date(current.LAST_TRANSACTION_IN_INTERVAL) > new Date(latest.LAST_TRANSACTION_IN_INTERVAL) 
            ? current : latest;
        }, customerTxns[0]);
        
        customer.lastActivity = latestTxn.LAST_TRANSACTION_IN_INTERVAL || 'Unknown';
      } else {
        customer.lastActivity = 'Unknown';
      }
      
      // Calculate DR/CR ratio properly
      const debitAmount = customerTxns
        .filter(t => t.DRCR_IND === 'D')
        .reduce((sum, t) => sum + t.TOTAL_AMOUNT_IN_INTERVAL, 0);
      
      const creditAmount = customerTxns
        .filter(t => t.DRCR_IND === 'C')
        .reduce((sum, t) => sum + t.TOTAL_AMOUNT_IN_INTERVAL, 0);
      
      // Avoid division by zero
      customer.drCrRatio = creditAmount > 0 ? debitAmount / creditAmount : debitAmount > 0 ? 999 : 0;
      
      // Normalize risk score based on transaction volume and flags
      // Base score from flags
      if (!customer.riskScore) customer.riskScore = 0;
      
      // Add risk based on transaction volume (higher volume = higher base risk)
      const volumeRisk = Math.min(30, Math.floor(customer.totalTransactions / 10));
      customer.riskScore += volumeRisk;
      
      // Add risk based on average transaction amount
      const amountRisk = Math.min(20, Math.floor(customer.averageAmount / 5000));
      customer.riskScore += amountRisk;
      
      // Add risk for unusual DR/CR ratio
      if (customer.drCrRatio > 5 || customer.drCrRatio < 0.2) {
        customer.riskScore += 15;
      }
      
      // Cap risk score at 100
      customer.riskScore = Math.min(100, customer.riskScore);
    });

    // Check for fraud patterns
    Object.entries(customerTransactions).forEach(([key, txns]) => {
      if (txns.length <= 1) return;

      const hasDebit = txns.some(t => t.DRCR_IND === 'D');
      const hasCredit = txns.some(t => t.DRCR_IND === 'C');
      const interval = txns[0].TRANSACTION_INTERVAL;
      const customerId = txns[0].CUSTOMER_ID;
      const customerName = txns[0].CUSTOMER_NAME;
      
      // Pattern 1: Same customer with both DR and CR in the same interval
      if (hasDebit && hasCredit) {
        const flag: FraudFlag = {
          customerId,
          customerName,
          transactionInterval: interval,
          flagType: 'DR_CR_SAME_INTERVAL',
          severity: 'MEDIUM',
          details: `Customer has both debit and credit transactions in the same 30-minute interval`
        };
        flags.push(flag);
        if (customerActivity[customerId]) {
          customerActivity[customerId].riskScore += 1;
        }
      }

      // Pattern 2: High frequency transactions
      const totalCount = txns.reduce((sum, t) => sum + t.TRANSACTION_COUNT, 0);
      if (totalCount > highFrequencyThreshold) {
        const flag: FraudFlag = {
          customerId,
          customerName,
          transactionInterval: interval,
          flagType: 'HIGH_FREQUENCY',
          severity: 'HIGH',
          details: `${totalCount} transactions in a 30-minute window (threshold: ${highFrequencyThreshold})`
        };
        flags.push(flag);
        if (customerActivity[customerId]) {
          customerActivity[customerId].riskScore += 2;
        }
      }

      // Pattern 3: Threshold avoidance (amounts just under 100,000)
      txns.forEach(t => {
        if (t.TOTAL_AMOUNT_IN_INTERVAL > thresholdAmount && t.TOTAL_AMOUNT_IN_INTERVAL < 100000) {
          const flag: FraudFlag = {
            customerId: t.CUSTOMER_ID,
            customerName: t.CUSTOMER_NAME,
            transactionInterval: t.TRANSACTION_INTERVAL,
            flagType: 'THRESHOLD_AVOIDANCE',
            severity: 'MEDIUM',
            details: `Transaction amount (${t.TOTAL_AMOUNT_IN_INTERVAL}) is just below the 100,000 threshold`
          };
          flags.push(flag);
          if (customerActivity[customerId]) {
            customerActivity[customerId].riskScore += 1;
          }
        }
      });
    });

    // Pattern 4: Unusual debit/credit ratios (per customer)
    Object.values(customerActivity).forEach(customer => {
      if (customer.drCrRatio > 10 || customer.drCrRatio < -10) {
        const flag: FraudFlag = {
          customerId: customer.customerId,
          customerName: customer.customerName,
          transactionInterval: '',
          flagType: 'UNUSUAL_RATIO',
          severity: 'LOW',
          details: `Unusual debit/credit ratio: ${customer.drCrRatio.toFixed(2)}`
        };
        flags.push(flag);
        customer.riskScore += 1;
      }
    });

    // Pattern 5: Volume spikes - detect unusual spikes in transaction amounts
    const sortedIntervals = Object.keys(intervalAmounts).sort();
    for (let i = 1; i < sortedIntervals.length; i++) {
      const prevInterval = sortedIntervals[i-1];
      const currInterval = sortedIntervals[i];
      
      // If current interval amount is more than 3x the previous interval
      if (intervalAmounts[currInterval] > intervalAmounts[prevInterval] * 3 && 
          intervalAmounts[currInterval] > 50000) {
        const flag: FraudFlag = {
          customerId: '',
          customerName: 'Multiple Customers',
          transactionInterval: currInterval,
          flagType: 'VOLUME_SPIKE',
          severity: 'HIGH',
          details: `Unusual spike in transaction volume: ${intervalAmounts[currInterval].toLocaleString()} (previous: ${intervalAmounts[prevInterval].toLocaleString()})`
        };
        flags.push(flag);
      }
    }

    // Pattern 6: Repeated identical amounts
    Object.entries(customerAmounts).forEach(([customerId, amounts]) => {
      Object.entries(amounts).forEach(([amountStr, count]) => {
        const amount = parseFloat(amountStr);
        if (count >= 3 && amount > 5000) {
          // Find a transaction with this customer ID to get the name
          const transaction = transactions.find(t => t.CUSTOMER_ID === customerId);
          if (transaction) {
            const flag: FraudFlag = {
              customerId,
              customerName: transaction.CUSTOMER_NAME,
              transactionInterval: '',
              flagType: 'REPEATED_AMOUNTS',
              severity: 'MEDIUM',
              details: `Customer has ${count} transactions with identical amount: ${amount.toLocaleString()}`
            };
            flags.push(flag);
            if (customerActivity[customerId]) {
              customerActivity[customerId].riskScore += 1;
            }
          }
        }
      });
    });

    return {
      transactions,
      flags,
      transactionsByInterval: Object.entries(transactionsByInterval).map(([interval, data]) => ({
        interval,
        ...data
      })),
      drCrDistribution: [
        { type: 'Debit', count: totalDebitCount, amount: totalDebitAmount },
        { type: 'Credit', count: totalCreditCount, amount: totalCreditAmount }
      ],
      customerActivity: Object.values(customerActivity),
      amountTrends: Object.entries(amountTrends).map(([interval, data]) => ({
        interval,
        ...data
      })),
      top10CustomersByVolume: Object.values(top10CustomersByVolume).sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 10),
      customerHeatmapData: Object.values(customerHeatmapData)
    };
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch data from the real API endpoint with date parameters
      const apiUrl = new URL('http://localhost:8944/api/transactions/intervals');
      
      // Add date parameters if provided
      if (startDate) {
        apiUrl.searchParams.append('startDate', startDate);
      }
      if (endDate) {
        apiUrl.searchParams.append('endDate', endDate);
      }
      
      const response = await fetch(apiUrl.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const jsonData: CustomerTransaction[] = await response.json();
      setData(jsonData);
      
      // Process the data to detect fraud patterns
      const processed = detectFraudPatterns(jsonData);
      setProcessedData(processed);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching fraud analytics data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch fraud analytics data'));
    } finally {
      setLoading(false);
    }
  };

  // Set up automatic refresh interval
  useEffect(() => {
    // Initial data fetch
    fetchData();
    
    // Set up refresh interval if specified
    let intervalId: NodeJS.Timeout | null = null;
    if (refreshInterval && refreshInterval > 0) {
      intervalId = setInterval(() => {
        fetchData();
      }, refreshInterval);
    }
    
    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [startDate, endDate, highFrequencyThreshold, thresholdAmount]); // Only re-run when these values change

  return {
    loading,
    error,
    data: processedData,
    refetch: fetchData
  };
}
