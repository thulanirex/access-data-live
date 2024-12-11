import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { IconRobot, IconUser } from '@tabler/icons-react';
import { Card } from '@/components/ui/card';

// Define the WebkitSpeechRecognition interface
interface IWebkitSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: (event: IWebkitSpeechRecognitionEvent) => void;
}

interface IWebkitSpeechRecognitionEvent {
  results: {
    item(index: number): {
      item(index: number): {
        transcript: string;
      };
    };
    length: number;
  };
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => IWebkitSpeechRecognition;
  }
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: 'banking' | 'incident' | 'analytics' | 'general';
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string, category?: 'banking' | 'incident' | 'analytics' | 'general') => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  onSendMessage,
}) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechSynthesis = window.speechSynthesis;
  const [recognition, setRecognition] = useState<IWebkitSpeechRecognition | null>(null);

  // Initialize speech recognition if supported
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: IWebkitSpeechRecognitionEvent) => {
        const results = Array.from({ length: event.results.length }, (_, i) => 
          event.results.item(i).item(0).transcript
        );
        const transcript = results.join('');
        setInput(transcript);
      };

      setRecognition(recognition);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const toggleListening = () => {
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setInput('');
    }
    setIsListening(!isListening);
  };

  const toggleSpeaking = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
    } else if (messages.length > 0) {
      const lastAssistantMessage = messages
        .filter(m => m.role === 'assistant')
        .pop();
      if (lastAssistantMessage) {
        const utterance = new SpeechSynthesisUtterance(lastAssistantMessage.content);
        speechSynthesis.speak(utterance);
      }
    }
    setIsSpeaking(!isSpeaking);
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 w-full max-w-4xl",
              message.role === 'assistant' ? 'ml-0' : 'ml-auto'
            )}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <IconRobot className="w-5 h-5 text-primary" />
              </div>
            )}
            <Card className={cn(
              "flex-1 p-4",
              message.role === 'assistant' 
                ? 'bg-muted/50 border-primary/10' 
                : 'bg-primary text-primary-foreground'
            )}>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm leading-relaxed">
                  {message.content}
                </p>
                <Badge 
                  variant={message.role === 'assistant' ? 'outline' : 'secondary'}
                  className="ml-2 shrink-0"
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Badge>
              </div>
            </Card>
            {message.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <IconUser className="w-5 h-5 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            AI is thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t bg-background p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <TooltipProvider>
            <div className="flex-1 flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant={isListening ? 'default' : 'outline'}
                    onClick={toggleListening}
                    className={cn(isListening && 'animate-pulse')}
                  >
                    {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isListening ? 'Stop Recording' : 'Start Recording'}
                </TooltipContent>
              </Tooltip>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isLoading}
              />
            </div>
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    size="icon"
                    variant={isSpeaking ? 'default' : 'outline'}
                    onClick={toggleSpeaking}
                  >
                    {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isSpeaking ? 'Stop Speaking' : 'Read Response'}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
                    <Send className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Send Message</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;