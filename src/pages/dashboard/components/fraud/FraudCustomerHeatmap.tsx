import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CustomerHeatmapData {
  customerId: string;
  customerName: string;
  intervals: {
    [key: string]: number;
  };
}

interface FraudCustomerHeatmapProps {
  data: CustomerHeatmapData[];
}

const FraudCustomerHeatmap: React.FC<FraudCustomerHeatmapProps> = ({ data }) => {
  const [customerFilter, setCustomerFilter] = useState('');

  // Get all unique intervals across all customers
  const allIntervals = new Set<string>();
  data.forEach(customer => {
    Object.keys(customer.intervals).forEach(interval => {
      allIntervals.add(interval);
    });
  });

  // Sort intervals chronologically
  const sortedIntervals = Array.from(allIntervals).sort();

  // Filter customers based on search
  const filteredCustomers = customerFilter
    ? data.filter(customer => 
        customer.customerName.toLowerCase().includes(customerFilter.toLowerCase()) ||
        customer.customerId.toLowerCase().includes(customerFilter.toLowerCase())
      )
    : data;

  // Limit to top 10 customers with most activity if no filter is applied
  const displayCustomers = customerFilter 
    ? filteredCustomers 
    : filteredCustomers
        .map(customer => ({
          ...customer,
          totalActivity: Object.values(customer.intervals).reduce((sum, count) => sum + count, 0)
        }))
        .sort((a, b) => b.totalActivity - a.totalActivity)
        .slice(0, 10);

  // Find the maximum transaction count for color scaling
  const maxCount = Math.max(
    ...displayCustomers.flatMap(customer => 
      Object.values(customer.intervals)
    ),
    1 // Ensure we have at least 1 to avoid division by zero
  );

  // Function to determine cell color intensity based on transaction count
  const getCellColor = (count: number) => {
    if (count === 0) return { backgroundColor: 'transparent' };
    
    // Use a gradient from light to dark
    const intensity = Math.min(Math.max(count / maxCount, 0.1), 1);
    
    // Use a gradient from green to red for better visual impact
    const hue = (1 - intensity) * 120; // 120 is green, 0 is red
    
    return {
      backgroundColor: `hsl(${hue}, 80%, ${70 - intensity * 25}%)`,
      color: intensity > 0.6 ? 'white' : 'inherit',
      fontWeight: intensity > 0.4 ? 'bold' : 'normal'
    };
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customer..."
            className="pl-8"
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="text-sm mr-2">Transaction Intensity:</div>
          <div className="flex items-center space-x-1">
            <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: 'hsl(120, 80%, 65%)' }}></div>
            <span className="text-xs">Low</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: 'hsl(80, 80%, 60%)' }}></div>
            <span className="text-xs">Medium</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: 'hsl(40, 80%, 55%)' }}></div>
            <span className="text-xs">High</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-5 h-5 rounded-sm" style={{ backgroundColor: 'hsl(0, 80%, 50%)' }}></div>
            <span className="text-xs">Very High</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="p-3 text-left border-b sticky left-0 bg-muted/50 z-10 min-w-[200px]">Customer</th>
              {sortedIntervals.map(interval => {
                const [date, time] = interval.split(' ');
                return (
                  <th key={interval} className="p-3 text-center border-b whitespace-nowrap">
                    {time}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {displayCustomers.length === 0 ? (
              <tr>
                <td colSpan={sortedIntervals.length + 1} className="p-4 text-center text-muted-foreground">
                  No customer data available
                </td>
              </tr>
            ) : (
              displayCustomers.map((customer, index) => (
                <tr key={customer.customerId} className={index % 2 === 0 ? 'bg-muted/10' : ''}>
                  <td className="p-3 border-b sticky left-0 bg-background z-10">
                    <div className="font-medium truncate max-w-[200px]" title={customer.customerName}>
                      {customer.customerName}
                    </div>
                    <div className="text-xs text-muted-foreground">{customer.customerId}</div>
                  </td>
                  {sortedIntervals.map(interval => {
                    const count = customer.intervals[interval] || 0;
                    return (
                      <td 
                        key={`${customer.customerId}-${interval}`} 
                        className="p-3 border-b text-center transition-colors duration-200"
                        style={getCellColor(count)}
                        title={`${customer.customerName}: ${count} transactions at ${interval}`}
                      >
                        {count > 0 ? count : ''}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FraudCustomerHeatmap;
