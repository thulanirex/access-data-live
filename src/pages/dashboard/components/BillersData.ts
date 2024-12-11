export interface BillerData {
    biller: string;
    successfulCount: number;
    successfulValue: number;
    failedCount: number;
    failedValue: number;
    avgValue: number;
  }
  
  // Static data array
  export const billersData: BillerData[] = [
    { biller: "Airtel", successfulCount: 1000, successfulValue: 50000, failedCount: 20, failedValue: 1000, avgValue: 50 },
    { biller: "MTN", successfulCount: 950, successfulValue: 47500, failedCount: 25, failedValue: 1250, avgValue: 50 },
    { biller: "Zamtel", successfulCount: 800, successfulValue: 40000, failedCount: 30, failedValue: 1500, avgValue: 50 },
    { biller: "Gotv", successfulCount: 700, successfulValue: 35000, failedCount: 10, failedValue: 500, avgValue: 50 },
    { biller: "DStv", successfulCount: 650, successfulValue: 32500, failedCount: 15, failedValue: 750, avgValue: 50 },
    { biller: "ZESCO", successfulCount: 73097, successfulValue: 60000, failedCount: 40, failedValue: 2000, avgValue: 50 },
    { biller: "LWSC", successfulCount: 500, successfulValue: 25000, failedCount: 5, failedValue: 250, avgValue: 50 },
    // { biller: "SchoolPay", successfulCount: 400, successfulValue: 20000, failedCount: 20, failedValue: 1000, avgValue: 50 },
    // { biller: "Government Services", successfulCount: 300, successfulValue: 15000, failedCount: 15, failedValue: 750, avgValue: 50 },
    // { biller: "Insurance", successfulCount: 550, successfulValue: 27500, failedCount: 25, failedValue: 1250, avgValue: 50 }
  ];
  