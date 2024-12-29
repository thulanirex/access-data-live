// @ts-nocheck
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  IconPlus,
  IconRefresh,
  IconSettings,
  IconPlugConnected,
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Integration } from '@/lib/types/data-source';

// Mock data - replace with actual API calls
const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'Core Banking API',
    type: 'api',
    config: {
      endpoint: 'https://api.core-banking.accessbank.com',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': '********',
      },
      authentication: {
        type: 'bearer',
        credentials: {
          token: '********',
        },
      },
      mapping: {
        transactionId: 'id',
        amount: 'value',
        timestamp: 'created_at',
      },
      schedule: '*/15 * * * *',
    },
    isActive: true,
    lastSync: new Date('2024-01-15'),
  },
];

const formSchema = z.object({
  name: z.string().min(2),
  type: z.enum(['api', 'webhook', 'file', 'custom']),
  config: z.object({
    endpoint: z.string().url().optional(),
    method: z.string().optional(),
    headers: z.record(z.string()).optional(),
    authentication: z.object({
      type: z.enum(['basic', 'bearer', 'oauth2']),
      credentials: z.record(z.string()),
    }).optional(),
    mapping: z.record(z.string()).optional(),
    format: z.string().optional(),
    schedule: z.string().optional(),
  }),
  isActive: z.boolean(),
});

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'api',
      config: {},
      isActive: true,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const integration: Integration = {
      ...values,
      id: selectedIntegration?.id || crypto.randomUUID(),
      lastSync: selectedIntegration?.lastSync,
    };

    if (selectedIntegration) {
      setIntegrations(prev =>
        prev.map(int => (int.id === integration.id ? integration : int))
      );
    } else {
      setIntegrations(prev => [...prev, integration]);
    }

    setIsDialogOpen(false);
    setSelectedIntegration(null);
    form.reset();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Integrations</h3>
        <p className="text-sm text-muted-foreground">
          Manage external system integrations and data pipelines
        </p>
      </div>

      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <IconPlus className="mr-2 h-4 w-4" />
              Add Integration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedIntegration ? 'Edit Integration' : 'New Integration'}
              </DialogTitle>
              <DialogDescription>
                Configure your integration settings
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Core Banking API" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="api">API</SelectItem>
                          <SelectItem value="webhook">Webhook</SelectItem>
                          <SelectItem value="file">File</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('type') === 'api' && (
                  <>
                    <FormField
                      control={form.control}
                      name="config.endpoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endpoint URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://api.example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="config.method"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Method</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="GET">GET</SelectItem>
                              <SelectItem value="POST">POST</SelectItem>
                              <SelectItem value="PUT">PUT</SelectItem>
                              <SelectItem value="DELETE">DELETE</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormField
                  control={form.control}
                  name="config.schedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Schedule (Cron Expression)</FormLabel>
                      <FormControl>
                        <Input placeholder="*/15 * * * *" {...field} />
                      </FormControl>
                      <FormDescription>
                        How often to sync data (e.g., every 15 minutes: */15 * * * *)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <FormDescription>
                          Enable or disable this integration
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit">
                    <IconPlugConnected className="mr-2 h-4 w-4" />
                    {selectedIntegration ? 'Update Integration' : 'Create Integration'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Sync</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {integrations.map((integration) => (
              <TableRow key={integration.id}>
                <TableCell className="font-medium">
                  {integration.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {integration.type.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{integration.config.schedule}</TableCell>
                <TableCell>
                  <Badge
                    variant={integration.isActive ? 'default' : 'secondary'}
                  >
                    {integration.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {integration.lastSync?.toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedIntegration(integration);
                        form.reset({
                          name: integration.name,
                          type: integration.type,
                          config: integration.config,
                          isActive: integration.isActive,
                        });
                        setIsDialogOpen(true);
                      }}
                    >
                      <IconSettings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <IconRefresh className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}