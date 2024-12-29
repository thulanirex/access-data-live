import React, { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { IconArrowUpRight, IconArrowDownRight } from "@tabler/icons-react";

// Simulated data generator
const generateRandomData = () => {
  return {
    transactions: Math.floor(Math.random() * 1000),
    successRate: 95 + Math.random() * 5,
    activeUsers: Math.floor(Math.random() * 500),
    timestamp: new Date().toISOString()
  };
};

 

const LiveStats = () => {
  const [data, setData] = useState<any[]>([]);
  const [currentStats, setCurrentStats] = useState(generateRandomData());

  useEffect(() => {
    // Update data every 2 seconds
    const interval = setInterval(() => {
      const newData = generateRandomData();
      setCurrentStats(newData);
      setData(prev => [...prev.slice(-20), newData]); // Keep last 20 points
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Live Metrics Cards */}
      <Card className="p-6">
        <div className="flex flex-col">
          <span className="text-sm font-medium">Transactions/min</span>
          <div className="flex items-center">
            <span className="text-2xl font-bold">{currentStats.transactions}</span>
            <IconArrowUpRight className="ml-2 h-4 w-4 text-green-500" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-col">
          <span className="text-sm font-medium">Success Rate</span>
          <div className="flex items-center">
            <span className="text-2xl font-bold">
              {currentStats.successRate.toFixed(2)}%
            </span>
            <Badge className="ml-2" variant="outline">Live</Badge>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-col">
          <span className="text-sm font-medium">Active Users</span>
          <div className="flex items-center">
            <span className="text-2xl font-bold">{currentStats.activeUsers}</span>
            <IconArrowUpRight className="ml-2 h-4 w-4 text-green-500" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex flex-col">
          <span className="text-sm font-medium">System Status</span>
          <div className="flex items-center">
            <Badge variant="default" className="animate-pulse bg-green-500">
              Operational
            </Badge>
          </div>
        </div>
      </Card>

      {/* Live Chart */}
      <Card className="col-span-full p-6">
        <h3 className="text-lg font-medium mb-4">Live Transaction Volume</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tick={false}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(label) => new Date(label).toLocaleTimeString()}
              />
              <Line 
                type="monotone" 
                dataKey="transactions" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default LiveStats;