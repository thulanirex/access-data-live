export interface DatabaseConfig {
  id: string;
  name: string;
  type: 'oracle' | 'postgresql' | 'mysql';
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  schema?: string;
  ssl?: boolean;
  subsidiary: string;
  region: string;
  isActive: boolean;
  lastTested?: Date;
  lastSync?: Date;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  sourceId: string;
  tableName: string;
  metrics: Metric[];
  transformations: Transformation[];
  isActive: boolean;
  refreshInterval: number; // in minutes
  lastSync?: Date;
}

export interface Metric {
  id: string;
  name: string;
  description: string;
  type: 'count' | 'sum' | 'average' | 'custom';
  field: string;
  aggregation?: string;
  customQuery?: string;
  format?: string;
  thresholds?: {
    warning: number;
    critical: number;
  };
}

export interface Transformation {
  id: string;
  type: 'filter' | 'map' | 'aggregate' | 'join' | 'custom';
  config: {
    condition?: string;
    mapping?: Record<string, string>;
    aggregation?: string;
    joinTable?: string;
    joinCondition?: string;
    customLogic?: string;
  };
  order: number;
}

export interface Pipeline {
  id: string;
  name: string;
  channelId: string;
  steps: PipelineStep[];
  schedule: string; // cron expression
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

export interface PipelineStep {
  id: string;
  type: 'extract' | 'transform' | 'load' | 'validate';
  config: Record<string, any>;
  order: number;
  dependsOn?: string[];
}

export interface Integration {
  id: string;
  name: string;
  type: 'api' | 'webhook' | 'file' | 'custom';
  config: {
    endpoint?: string;
    method?: string;
    headers?: Record<string, string>;
    authentication?: {
      type: 'basic' | 'bearer' | 'oauth2';
      credentials: Record<string, string>;
    };
    mapping?: Record<string, string>;
    format?: string;
    schedule?: string;
  };
  isActive: boolean;
  lastSync?: Date;
}

export interface AccessPay {
  
}