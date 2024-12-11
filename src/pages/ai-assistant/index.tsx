import { useState } from 'react';
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';
import ChatInterface from '@/components/ChatInterface';
import PredefinedPrompts from '@/components/PredefinedPrompts';
import { Card } from '@/components/ui/card';
import ChatChart from '@/components/ChatCharts';

interface ChartConfig {
  type: 'line' | 'bar' | 'area';
  title: string;
  data: Array<{ name: string; value: number }>;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  charts?: ChartConfig[];
  category?: 'banking' | 'incident' | 'analytics' | 'general';
}

type ResponseType = {
  text: string;
  charts?: ChartConfig[];
};

const mockResponses: Record<'banking' | 'incident' | 'analytics', Record<string, ResponseType>> = {
  banking: {
    "Show channel transaction summary for today": {
      text: "Based on today's data:\n\nTotal Volume: $12.4M\nSuccess Rate: 99.2%",
      charts: [
        {
          type: 'bar',
          title: 'Transaction Volume by Channel',
          data: [
            { name: 'Mobile', value: 89012 },
            { name: 'POS', value: 45678 },
            { name: 'ATM', value: 15234 }
          ]
        }
      ]
    },
    "Compare ATM vs POS transaction volumes": {
      text: "Current Analysis:\n\nATM Transactions:\n- Average Value: $245\n- Peak Time: 12-2 PM\n\nPOS Transactions:\n- Average Value: $127\n- Peak Time: 5-7 PM",
      charts: [
        {
          type: 'line',
          title: 'Hourly Transaction Volume',
          data: [
            { name: '6AM', value: 1200 },
            { name: '9AM', value: 4500 },
            { name: '12PM', value: 8900 },
            { name: '3PM', value: 7200 },
            { name: '6PM', value: 5100 },
            { name: '9PM', value: 2300 }
          ]
        }
      ]
    },
    "Show failed transactions by channel": {
      text: "Failed Transactions Summary:\n\nTotal Failures: 83\nMTTR: 15 minutes\nResolution Rate: 94%",
      charts: [
        {
          type: 'bar',
          title: 'Failures by Channel',
          data: [
            { name: 'ATM', value: 23 },
            { name: 'POS', value: 45 },
            { name: 'Mobile', value: 15 }
          ]
        }
      ]
    }
  },
  analytics: {
    "Show transaction trends": {
      text: "Transaction Trends Analysis:\n\nWeek-over-Week Growth: +5.8%\nPeak Day: Friday (62,567 transactions)",
      charts: [
        {
          type: 'area',
          title: 'Daily Transaction Volume',
          data: [
            { name: 'Mon', value: 52345 },
            { name: 'Tue', value: 54678 },
            { name: 'Wed', value: 58901 },
            { name: 'Thu', value: 57234 },
            { name: 'Fri', value: 62567 },
            { name: 'Sat', value: 48901 },
            { name: 'Sun', value: 45678 }
          ]
        }
      ]
    },
    "Compare this month's vs last month's metrics": {
      text: "Monthly Performance:\n\nGrowth: +9.2% in Volume\nSuccess Rate Improvement: +0.2%",
      charts: [
        {
          type: 'bar',
          title: 'Monthly Comparison',
          data: [
            { name: 'Last Month', value: 1100000 },
            { name: 'This Month', value: 1200000 }
          ]
        }
      ]
    },
    "Show top performing channels": {
      text: "Channel Performance Analysis:\n\nFastest Growing: Mobile Banking (+12%)\nMost Stable: ATM (+3%)",
      charts: [
        {
          type: 'bar',
          title: 'Channel Performance',
          data: [
            { name: 'Mobile', value: 450000 },
            { name: 'Internet', value: 380000 },
            { name: 'ATM', value: 250000 }
          ]
        }
      ]
    }
  },
  incident: {
    "List recent system incidents": {
      text: "Recent Incidents (Last 24hrs):\n\n1. Network Latency Spike\n- Duration: 15 mins\n- Impact: Minor\n- Resolution: Auto-recovered\n\n2. Payment Gateway Timeout\n- Duration: 5 mins\n- Impact: Moderate\n- Resolution: Failover activated",
      charts: [
        {
          type: 'line',
          title: 'System Response Time',
          data: [
            { name: '00:00', value: 100 },
            { name: '06:00', value: 120 },
            { name: '12:00', value: 450 },
            { name: '18:00', value: 380 },
            { name: 'Now', value: 150 }
          ]
        }
      ]
    },
    "Show critical alerts": {
      text: "Critical Alerts:\n\n🔴 High CPU Usage - Server DB-01\n🔴 Memory Usage - App Server",
      charts: [
        {
          type: 'area',
          title: 'Resource Usage',
          data: [
            { name: 'CPU', value: 92 },
            { name: 'Memory', value: 87 },
            { name: 'Disk', value: 65 },
            { name: 'Network', value: 45 }
          ]
        }
      ]
    }
  }
};

export default function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const simulateTypingEffect = async (response: string, callback: (partial: string) => void) => {
    const words = response.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? '' : ' ') + words[i];
      callback(currentText);
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
    }
  };

  const handleSendMessage = async (content: string, category: 'banking' | 'incident' | 'analytics' | 'general' = 'general') => {
    setIsLoading(true);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
      category
    };
    
    setMessages(prev => [...prev, userMessage]);

    const categoryResponses = mockResponses[category as keyof typeof mockResponses];
    const response = categoryResponses?.[content] || { 
      text: `I understand you're asking about ${category}. Let me analyze that for you...`
    };

    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      category,
      charts: response.charts
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(true);

    await simulateTypingEffect(response.text, (partial) => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: partial }
            : msg
        )
      );
    });

    setIsTyping(false);
    setIsLoading(false);
  };

  const handlePromptSelect = (prompt: string, category: 'banking' | 'incident' | 'analytics' | 'general') => {
    handleSendMessage(prompt, category);
  };

  return (
    <Layout>
      <LayoutHeader>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>
      <LayoutBody className='space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            AI Assistant
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-3">
            <Card className="p-4">
              <ChatInterface
                messages={messages}
                isLoading={isLoading || isTyping}
                onSendMessage={handleSendMessage}
              />
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card className="p-4">
              <PredefinedPrompts onSelectPrompt={handlePromptSelect} />
            </Card>
          </div>
        </div>
      </LayoutBody>
    </Layout>
  );
}