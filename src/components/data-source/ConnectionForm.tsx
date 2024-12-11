import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { IconDatabase, IconTestPipe } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
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
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { DatabaseConfig } from '@/lib/types/data-source';
import { TestConnection } from './TestConnection';

const formSchema = z.object({
  name: z.string().min(2).max(50),
  type: z.enum(['oracle', 'postgresql', 'mysql']),
  host: z.string().min(1),
  port: z.number().min(1).max(65535),
  database: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
  schema: z.string().optional(),
  ssl: z.boolean().default(false),
  subsidiary: z.string().min(1),
  region: z.string().min(1),
  isActive: z.boolean().default(true),
});

interface ConnectionFormProps {
  initialData?: DatabaseConfig;
  onSubmit: (data: DatabaseConfig) => void;
}

export default function ConnectionForm({ initialData, onSubmit }: ConnectionFormProps) {
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      type: 'oracle',
      ssl: false,
      isActive: true,
      port: 1521, // Default Oracle port
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...values,
      id: initialData?.id || crypto.randomUUID(),
      lastTested: initialData?.lastTested,
      lastSync: initialData?.lastSync,
    });
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    const values = form.getValues();
    // Implement actual connection testing logic here
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
    setIsTestingConnection(false);
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Connection Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Production DB" {...field} />
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
                  <FormLabel>Database Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select database type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="oracle">Oracle</SelectItem>
                      <SelectItem value="postgresql">PostgreSQL</SelectItem>
                      <SelectItem value="mysql">MySQL</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="host"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host</FormLabel>
                  <FormControl>
                    <Input placeholder="localhost" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={e => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="database"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Database Name</FormLabel>
                  <FormControl>
                    <Input placeholder="mydb" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="schema"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schema</FormLabel>
                  <FormControl>
                    <Input placeholder="public" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subsidiary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subsidiary</FormLabel>
                  <FormControl>
                    <Input placeholder="Access Bank Zambia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <FormControl>
                    <Input placeholder="Southern Africa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ssl"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">SSL Connection</FormLabel>
                    <FormDescription>
                      Use SSL/TLS for secure database connection
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

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active</FormLabel>
                    <FormDescription>
                      Enable or disable this connection
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
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleTestConnection}
              disabled={isTestingConnection}
            >
              <IconTestPipe className="mr-2 h-4 w-4" />
              Test Connection
            </Button>
            <Button type="submit">
              <IconDatabase className="mr-2 h-4 w-4" />
              {initialData ? 'Update Connection' : 'Create Connection'}
            </Button>
          </div>
        </form>
      </Form>

      <TestConnection
        isOpen={isTestingConnection}
        onClose={() => setIsTestingConnection(false)}
      />
    </Card>
  );
}