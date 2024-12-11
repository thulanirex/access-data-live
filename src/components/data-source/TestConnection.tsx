import { useEffect, useState } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TestConnectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TestConnection({ isOpen, onClose }: TestConnectionProps) {
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const steps = [
    'Validating connection parameters...',
    'Establishing connection...',
    'Testing database access...',
    'Checking schema permissions...',
    'Connection test complete!',
  ];

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setError(null);
      const timer = setInterval(() => {
        setStep((prev) => {
          if (prev === steps.length - 1) {
            clearInterval(timer);
            // Simulate random error for demonstration
            if (Math.random() > 0.7) {
              setError('Failed to connect: Connection timed out');
            }
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Testing Connection</DialogTitle>
          <DialogDescription>
            Verifying database connection and permissions
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {steps.map((text, index) => (
            <div
              key={index}
              className="mb-4 flex items-center justify-between text-sm"
            >
              <span
                className={
                  index <= step
                    ? error && index === step
                      ? 'text-destructive'
                      : 'text-foreground'
                    : 'text-muted-foreground'
                }
              >
                {text}
              </span>
              <span>
                {index < step && !error && (
                  <IconCheck className="h-4 w-4 text-green-500" />
                )}
                {index === step && !error && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                )}
                {index === step && error && (
                  <IconX className="h-4 w-4 text-destructive" />
                )}
              </span>
            </div>
          ))}

          {error && (
            <div className="mt-4 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}