// @ts-nocheck
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  IconPlus,
  IconTrash,
  IconArrowsSort,
  IconDeviceAnalytics,
} from '@tabler/icons-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Channel, Metric, Transformation } from '@/lib/types/data-source';

const metricSchema = z.object({
  name: z.string().min(2),
  description: z.string(),
  type: z.enum(['count', 'sum', 'average', 'custom']),
  field: z.string(),
  aggregation: z.string().optional(),
  customQuery: z.string().optional(),
  format: z.string().optional(),
  thresholds: z
    .object({
      warning: z.number(),
      critical: z.number(),
    })
    .optional(),
});

const transformationSchema = z.object({
  type: z.enum(['filter', 'map', 'aggregate', 'join', 'custom']),
  config: z.object({
    condition: z.string().optional(),
    mapping: z.record(z.string()).optional(),
    aggregation: z.string().optional(),
    joinTable: z.string().optional(),
    joinCondition: z.string().optional(),
    customLogic: z.string().optional(),
  }),
  order: z.number(),
});

const formSchema = z.object({
  name: z.string().min(2),
  description: z.string(),
  tableName: z.string().min(1),
  metrics: z.array(metricSchema),
  transformations: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
      type: z.enum(['filter', 'map', 'aggregate', 'join', 'custom']),
      config: z.object({
        aggregation: z.string().optional(),
        condition: z.string().optional(),
        mapping: z.record(z.string()).optional(),
        joinTable: z.string().optional(),
        joinCondition: z.string().optional(),
        customLogic: z.string().optional(),
      }),
    })
  ),
  refreshInterval: z.number().min(1),
  isActive: z.boolean(),
});

interface ChannelFormProps {
  initialData?: Channel;
  sourceId: string;
  onSubmit: (data: Channel) => void;
}

export default function ChannelForm({
  initialData,
  sourceId,
  onSubmit,
}: ChannelFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      metrics: [],
      transformations: [],
      refreshInterval: 15,
      isActive: true,
    },
  });

  const { fields: metricFields, append: appendMetric, remove: removeMetric } = 
  useFieldArray({
    control: form.control,
    name: 'metrics',
  });

const { 
  fields: transformationFields, 
  append: appendTransformation, 
  remove: removeTransformation,
  swap: swapTransformation,
} = useFieldArray({
  control: form.control,
  name: 'transformations',
});

const handleSubmit = (values: z.infer<typeof formSchema>) => {
  const formattedMetrics: Metric[] = values.metrics.map(metric => ({
    ...metric,
    id: crypto.randomUUID(),
    name: metric.name,
    description: metric.description,
    type: metric.type,
    field: metric.field
  }));

  const formattedTransformations = values.transformations.map((transform, index) => ({
    ...transform,
    id: crypto.randomUUID(),
    order: index
  })) as Transformation[];

  onSubmit({
    id: initialData?.id || crypto.randomUUID(),
    name: values.name,
    description: values.description,
    sourceId,
    tableName: values.tableName,
    lastSync: initialData?.lastSync,
    metrics: formattedMetrics,
    transformations: formattedTransformations,
    isActive: values.isActive,
    refreshInterval: values.refreshInterval,
  });
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
                  <FormLabel>Channel Name</FormLabel>
                  <FormControl>
                    <Input placeholder="ATM Transactions" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tableName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Table Name</FormLabel>
                  <FormControl>
                    <Input placeholder="transactions" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Channel description..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="refreshInterval"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Refresh Interval (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
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
                      Enable or disable this channel
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

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Metrics</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendMetric({
                    name: '',
                    description: '',
                    type: 'count',
                    field: '',
                  })
                }
              >
                <IconPlus className="mr-2 h-4 w-4" />
                Add Metric
              </Button>
            </div>

            {metricFields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`metrics.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Metric Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Transaction Count" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`metrics.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="count">Count</SelectItem>
                            <SelectItem value="sum">Sum</SelectItem>
                            <SelectItem value="average">Average</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`metrics.${index}.field`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Field</FormLabel>
                        <FormControl>
                          <Input placeholder="amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeMetric(index)}
                    >
                      <IconTrash className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Transformations</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendTransformation({
                    type: 'filter',
                    config: {} ,
                    order: transformationFields.length,
                  })
                }
              >
                <IconPlus className="mr-2 h-4 w-4" />
                Add Transformation
              </Button>
            </div>

            {transformationFields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`transformations.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="filter">Filter</SelectItem>
                            <SelectItem value="map">Map</SelectItem>
                            <SelectItem value="aggregate">Aggregate</SelectItem>
                            <SelectItem value="join">Join</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-end space-x-2">
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => swapTransformation(index, index - 1)}
                      >
                        <IconArrowsSort className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeTransformation(index)}
                    >
                      <IconTrash className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>

                  {/* Conditional fields based on transformation type */}
                  {form.watch(`transformations.${index}.type`) === 'filter' && (
                    <FormField
                      control={form.control}
                      name={`transformations.${index}.config.condition`}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Filter Condition</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="amount > 1000 AND status = 'SUCCESS'"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {form.watch(`transformations.${index}.type`) === 'custom' && (
                    <FormField
                      control={form.control}
                      name={`transformations.${index}.config.customLogic`}
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Custom Logic</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Custom transformation logic..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              <IconDeviceAnalytics className="mr-2 h-4 w-4" />
              {initialData ? 'Update Channel' : 'Create Channel'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}