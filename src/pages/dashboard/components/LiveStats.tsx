import { useChannelStats } from "@/hooks/useChannelStats";
import { Card } from "@/components/ui/card";
import { Loader2, Activity, Check, AlertTriangle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export function LiveStats() {
  const { data, isLoading, error } = useChannelStats();

  if (isLoading) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center text-destructive">
        <p className="text-sm">Failed to load live statistics</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-emerald-500 text-emerald-500 border-emerald-500';
      case 'degraded':
        return 'bg-amber-500 text-amber-500 border-amber-500';
      case 'down':
        return 'bg-red-500 text-red-500 border-red-500';
      default:
        return 'bg-gray-500 text-gray-500 border-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <Check className="h-4 w-4" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4" />;
      case 'down':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Success Rate</p>
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold">{data.overallSuccessRate.toFixed(1)}%</h3>
                </div>
                <Progress 
                  value={data.overallSuccessRate} 
                  className="mt-2"
                  indicatorClassName={
                    data.overallSuccessRate >= 90 ? "bg-emerald-500" :
                    data.overallSuccessRate >= 70 ? "bg-amber-500" : "bg-red-500"
                  }
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Channels</p>
              <h3 className="text-2xl font-bold">{data.activeChannels}</h3>
            </div>
            <Activity className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Transactions</p>
              <h3 className="text-2xl font-bold">{data.totalTransactions.toLocaleString()}</h3>
            </div>
            <Activity className="h-8 w-8 text-muted-foreground opacity-50" />
          </div>
        </Card>
      </div>

      {/* Channel Status Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {data.channels.map((channel) => (
            <motion.div
              key={channel.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{channel.name}</h3>
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(channel.status)}
                  >
                    <span className="flex items-center gap-1">
                      {getStatusIcon(channel.status)}
                      {channel.status.charAt(0).toUpperCase() + channel.status.slice(1)}
                    </span>
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Success Rate</p>
                    <Progress 
                      value={channel.successRate} 
                      className="h-2"
                      indicatorClassName={getStatusColor(channel.status)}
                    />
                    <p className="text-sm font-medium mt-1">{channel.successRate.toFixed(1)}%</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Transactions</span>
                      <span className="font-medium">{channel.totalTransactions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Successful</span>
                      <span className="font-medium text-emerald-500">
                        {channel.successfulTransactions.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Failed</span>
                      <span className="font-medium text-red-500">
                        {channel.failedTransactions.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Last updated: {new Date(channel.lastUpdated).toLocaleTimeString()}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}