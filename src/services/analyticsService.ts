import axios from 'axios';
import { ApiResponse } from '../types/api';

// Use proxy URL instead of direct API URL
const API_BASE = '/api/v1';

export const fetchAnalyticsData = async (startDate: string, endDate: string, channel?: string) => {
    try {
        // Construct URL to match exact API path
        const url = `${API_BASE}/access_data_analytic/`;
        const params = {
            start_timestamp: startDate,
            end_timestamp: endDate,
            channel_name: channel || 'TENGA'
        };
        
        console.log('=== Analytics API Request ===');
        console.log('Full URL:', `${url}?${new URLSearchParams(params)}`);
        console.log('Params:', params);

        const response = await axios.get(url, { 
            params,
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });

        console.log('=== Analytics API Response ===');
        console.log('Status:', response.status);
        console.log('Headers:', response.headers);
        console.log('Data:', response.data);

        if (!response.data) {
            throw new Error('No data received from API');
        }

        return response.data as ApiResponse;
    } catch (error: any) {
        console.error('=== Analytics API Error ===');
        console.error('Request URL:', error.config?.url);
        console.error('Request Params:', error.config?.params);
        console.error('Request Headers:', error.config?.headers);
        console.error('Response Status:', error.response?.status);
        console.error('Response Headers:', error.response?.headers);
        console.error('Response Data:', error.response?.data);
        console.error('Error Message:', error.message);
        throw error;
    }
};
