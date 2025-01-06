export interface TransactionData {
  FAILED_TRANSACTIONS: number;
  SUCCESSFUL_TRANSACTIONS: number;
  TOTAL_TRANSACTIONS: number;
  TRANSACTION_TYPE: string;
}

export interface ApiResponse {
  channel: string;
  detailReport: TransactionData[];
  failed: number;
  percentFailed: number;
  percentSuccess: number;
  success: number;
  total: number;
}

// Transformed data interfaces for charts
export interface SuccessFailureData {
  name: string;
  value: number;
  percent: number;
}

export interface ChannelMetrics {
  channel: string;
  successCount: number;
  failureCount: number;
  totalTransactions: number;
  successRate: number;
}

export interface TransactionTypeMetrics {
  type: string;
  channel: string;
  successCount: number;
  failureCount: number;
  total: number;
  successRate: number;
}

export interface USSD202ServiceDetail {
  failed: number;
  service: string;
  success: number;
  total: number;
}

export interface USSD202Response {
  channel: string;
  detailReport: USSD202ServiceDetail[];
  failed: number;
  percentFailed: number;
  percentSuccess: number;
  statusCode: number;
  success: number;
  total: number;
}

export interface RIBServiceDetail {
  FAILED_TRANSACTIONS: number;
  SUCCESSFUL_TRANSACTIONS: number;
  TOTAL_TRANSACTIONS: number;
  TRANSACTION_TYPE: string;
}

export interface AgencyBankingServiceDetail {
  FAILED_TRANSACTIONS: number;
  SUCCESSFUL_TRANSACTIONS: number;
  TOTAL_TRANSACTIONS: number;
  TRANSACTION_TYPE: string;
}

export interface RIBResponse {
  channel: string;
  detailReport: RIBServiceDetail[];
  failed: number;
  percentFailed: number;
  percentSuccess: number;
  success: number;
  total: number;
}

export interface AgencyBankingResponse {
  channel: string;
  detailReport: AgencyBankingServiceDetail[];
  failed: number;
  percentFailed: number;
  percentSuccess: number;
  success: number;
  total: number;
}

export interface USSD360Response {
  channel: string;
  detailReport: {
      FAILED_TRANSACTIONS: number;
      SUCCESSFUL_TRANSACTIONS: number;
      TOTAL_TRANSACTIONS: number;
      TRANSACTION_TYPE: string;
  }[];
  failed: number;
  percentFailed: number;
  percentSuccess: number;
  success: number;
  total: number;
}
export interface AccessPayDetailReport {
  BANK_TYPE_DESCRIPTION: string;
  FAILED_RATE: number;
  FAILED_TRANSACTIONS: number;
  FINALIZED_RATE: number;
  FINALIZED_TRANSACTIONS: number;
  PENDING_RATE: number;
  PENDING_TRANSACTIONS: number;
  STATUS_DESCRIPTION: string;
  TRANSACTION_COUNT: number;
}

export interface AccessPayResponse {
  channel: string;
  detailReport: AccessPayDetailReport[];
  statusCode: number;
  timestamp: string;
}