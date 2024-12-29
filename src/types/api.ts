export interface TransactionData {
    FAILED: number;
    FTTYPE: string;
    PERCENT_FAILED: number;
    PERCENT_SUCCESS: number;
    SUCCESS: number;
    TOTAL: number;
}

export interface ChannelData {
    CHANNEL: string;
    DATA: TransactionData[];
}

export interface ApiResponse {
    channelsData: ChannelData[];
    message: string;
    percentFailed: number;
    percentSuccess: number;
    statusCode: number;
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
