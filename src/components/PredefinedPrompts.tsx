// components/PredefinedPrompts.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
// import { Card } from '@/components/ui/card';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Prompt {
  text: string;
  category: 'banking' | 'incident' | 'analytics' | 'general';
}

interface PredefinedPromptsProps {
  onSelectPrompt: (prompt: string, category: 'banking' | 'incident' | 'analytics' | 'general') => void;
}

const PredefinedPrompts: React.FC<PredefinedPromptsProps> = ({ onSelectPrompt }) => {
  const prompts: Record<string, Prompt[]> = {
    banking: [
      { text: "Show channel transaction summary for today", category: 'banking' },
      { text: "Compare ATM vs POS transaction volumes", category: 'banking' },
      { text: "Show failed transactions by channel", category: 'banking' },
      { text: "Generate daily settlement report", category: 'banking' },
    ],
    incident: [
      { text: "Show critical incidents in the last 24 hours", category: 'incident' },
      { text: "List unresolved IT incidents", category: 'incident' },
      { text: "Show incident resolution time trends", category: 'incident' },
      { text: "Generate incident summary report", category: 'incident' },
    ],
    analytics: [
      { text: "Show channel usage patterns", category: 'analytics' },
      { text: "Generate performance metrics dashboard", category: 'analytics' },
      { text: "Compare this month's vs last month's metrics", category: 'analytics' },
      { text: "Show top performing channels", category: 'analytics' },
    ]
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Quick Actions</h2>
      <Tabs defaultValue="banking" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="banking">Banking</TabsTrigger>
          <TabsTrigger value="incident">Incidents</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        {Object.entries(prompts).map(([category, categoryPrompts]) => (
          <TabsContent key={category} value={category} className="space-y-2">
            {categoryPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left justify-start"
                onClick={() => onSelectPrompt(prompt.text, prompt.category)}
              >
                {prompt.text}
              </Button>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PredefinedPrompts;