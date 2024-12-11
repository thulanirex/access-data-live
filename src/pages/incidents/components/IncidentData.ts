export const resolutionData = [
    { name: 'January', hours: 72 },
    { name: 'February', hours: 48 },
    { name: 'March', hours: 68 },
    { name: 'April', hours: 24 },
    { name: 'May', hours: 48 }
];

export const availabilityData = [
    { name: 'Uptime', value: 95 },
    { name: 'Downtime', value: 5 }
];

export const issuesByDepartmentData = [
    { department: 'Enterprise Applications', open: 120, closed: 300 },
    { department: 'Infrastructure & Networks', open: 150, closed: 90 },
    { department: 'Digital Channels', open: 50, closed: 80 },
    { department: 'ATM & Cards', open: 70, closed: 200 }
];

export const serviceData = [
    { name: 'Mobile Banking', uptime: 95, downtime: 5 },
    { name: 'ATMs', uptime: 90, downtime: 10 },
    { name: 'OBDX', uptime: 85, downtime: 15 },
    { name: 'Tenga', uptime: 80, downtime: 20 },
    { name: 'USSD', uptime: 95, downtime: 5 },
    { name: 'Retail Internet Banking', uptime: 88, downtime: 12 },
    { name: 'SME Banking', uptime: 92, downtime: 8 },
    { name: 'POS', uptime: 93, downtime: 7 },
    { name: 'VISA / ECOMMERCE', uptime: 90, downtime: 10 }
];

export interface DepartmentMetrics {
    department: string;
    openIssues: number;
    closedIssues: number;
    avgResolutionTime: string;  // Example format: '48 hours'
}

export interface ChannelMetrics {
    channel: string;
    uptimePercent: number;
    downtimePercent: number;
    incidentsReported: number;
}

export const departmentData: DepartmentMetrics[] = [
    { department: 'IT', openIssues: 120, closedIssues: 300, avgResolutionTime: '24 hours' },
    { department: 'Customer Support', openIssues: 75, closedIssues: 150, avgResolutionTime: '36 hours' },
    { department: 'HR', openIssues: 20, closedIssues: 98, avgResolutionTime: '72 hours' },
];


export interface TableData {
    department: string;
    openIssues: number;
    closedIssues: number;
    avgResolutionTime: string;  // e.g., "24 hours"
    successRate: string;        // e.g., "95%"
    trend: 'up' | 'down';       // Indicating whether the trend is positive or negative
}

export const tableData: TableData[] = [
    { department: "Digital Channels", openIssues: 120, closedIssues: 300, avgResolutionTime: "24 hours", successRate: "95%", trend: "up" },
    { department: "Enterprise Applications Development", openIssues: 75, closedIssues: 150, avgResolutionTime: "36 hours", successRate: "90%", trend: "down" },
    { department: "Infrastructure & Networks", openIssues: 20, closedIssues: 98, avgResolutionTime: "72 hours", successRate: "88%", trend: "up" },
    { department: "ATM / Card Operations", openIssues: 20, closedIssues: 98, avgResolutionTime: "72 hours", successRate: "88%", trend: "up" },
    { department: "Infrastructure & Networks", openIssues: 20, closedIssues: 98, avgResolutionTime: "72 hours", successRate: "88%", trend: "up" },
];

export const channelData: ChannelMetrics[] = [
    { channel: 'Mobile Banking', uptimePercent: 99, downtimePercent: 1, incidentsReported: 12 },
    { channel: 'ATMs', uptimePercent: 95, downtimePercent: 5, incidentsReported: 20 },
    { channel: 'OBDX', uptimePercent: 97, downtimePercent: 3, incidentsReported: 5 },
    { channel: 'Tenga', uptimePercent: 98, downtimePercent: 2, incidentsReported: 8 },
    { channel: 'USSD', uptimePercent: 96, downtimePercent: 4, incidentsReported: 15 },
    { channel: 'Retail Internet Banking', uptimePercent: 94, downtimePercent: 6, incidentsReported: 22 },
    { channel: 'SME Banking', uptimePercent: 93, downtimePercent: 7, incidentsReported: 19 },
    { channel: 'POS', uptimePercent: 90, downtimePercent: 10, incidentsReported: 25 },
    { channel: 'VISA / ECOMMERCE', uptimePercent: 91, downtimePercent: 9, incidentsReported: 18 }
];