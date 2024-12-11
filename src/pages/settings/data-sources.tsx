import { useState } from 'react';
import {
  IconDatabase,
  IconPlus,
  IconRefresh,
  IconSettings,
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import ConnectionForm from '@/components/data-source/ConnectionForm';
import ChannelForm from '@/components/data-source/ChannelForm';
import { DatabaseConfig, Channel } from '@/lib/types/data-source';

// Mock data - replace with actual API calls
const mockConnections: DatabaseConfig[] = [
  {
    id: '1',
    name: 'Zambia Production DB',
    type: 'oracle',
    host: 'oracle.zambia.accessbank',
    port: 1521,
    database: 'PRODDB',
    username: 'admin',
    password: '********',
    subsidiary: 'Access Bank Zambia',
    region: 'Southern Africa',
    isActive: true,
    lastTested: new Date('2024-01-15'),
    lastSync: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Angola Production DB',
    type: 'oracle',
    host: 'oracle.angola.accessbank',
    port: 1521,
    database: 'PRODDB',
    username: 'admin',
    password: '********',
    subsidiary: 'Access Bank Angola',
    region: 'Southern Africa',
    isActive: true,
    lastTested: new Date('2024-01-15'),
    lastSync: new Date('2024-01-15'),
  },
];

const mockChannels: Channel[] = [
  {
    id: '1',
    name: 'ATM Transactions',
    description: 'All ATM transaction data',
    sourceId: '1',
    tableName: 'ATM_TRANSACTIONS',
    metrics: [
      {
        id: '1',
        name: 'Transaction Count',
        description: 'Total number of transactions',
        type: 'count',
        field: '*',
      },
      {
        id: '2',
        name: 'Transaction Volume',
        description: 'Total transaction amount',
        type: 'sum',
        field: 'amount',
      },
    ],
    transformations: [
      {
        id: '1',
        type: 'filter',
        config: {
          condition: "status = 'SUCCESS'",
        },
        order: 0,
      },
    ],
    isActive: true,
    refreshInterval: 15,
    lastSync: new Date('2024-01-15'),
  },
];

export default function DataSourcesPage() {
  const [connections, setConnections] = useState<DatabaseConfig[]>(mockConnections);
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [selectedConnection, setSelectedConnection] = useState<DatabaseConfig | null>(null);
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false);
  const [isChannelDialogOpen, setIsChannelDialogOpen] = useState(false);

  const handleConnectionSubmit = (data: DatabaseConfig) => {
    if (selectedConnection) {
      setConnections(prev =>
        prev.map(conn => (conn.id === data.id ? data : conn))
      );
    } else {
      setConnections(prev => [...prev, data]);
    }
    setIsConnectionDialogOpen(false);
    setSelectedConnection(null);
  };

  const handleChannelSubmit = (data: Channel) => {
    if (channels.find(ch => ch.id === data.id)) {
      setChannels(prev =>
        prev.map(ch => (ch.id === data.id ? data : ch))
      );
    } else {
      setChannels(prev => [...prev, data]);
    }
    setIsChannelDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Data Sources</h3>
        <p className="text-sm text-muted-foreground">
          Manage your database connections and data channels
        </p>
      </div>

      <Tabs defaultValue="connections">
        <TabsList>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="connections" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isConnectionDialogOpen} onOpenChange={setIsConnectionDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Add Connection
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>
                    {selectedConnection ? 'Edit Connection' : 'New Connection'}
                  </DialogTitle>
                  <DialogDescription>
                    Configure your database connection settings
                  </DialogDescription>
                </DialogHeader>
                <ConnectionForm
                  initialData={selectedConnection || undefined}
                  onSubmit={handleConnectionSubmit}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Subsidiary</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Sync</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connections.map((connection) => (
                  <TableRow key={connection.id}>
                    <TableCell className="font-medium">
                      {connection.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {connection.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{connection.subsidiary}</TableCell>
                    <TableCell>{connection.region}</TableCell>
                    <TableCell>
                      <Badge
                        variant={connection.isActive ? 'default' : 'secondary'}
                      >
                        {connection.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {connection.lastSync?.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedConnection(connection);
                            setIsConnectionDialogOpen(true);
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
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <div className="flex justify-end">
            <Dialog open={isChannelDialogOpen} onOpenChange={setIsChannelDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Add Channel
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>New Channel</DialogTitle>
                  <DialogDescription>
                    Configure your data channel settings
                  </DialogDescription>
                </DialogHeader>
                <ChannelForm
                  sourceId={connections[0]?.id}
                  onSubmit={handleChannelSubmit}
                />
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Metrics</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Sync</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {channels.map((channel) => (
                  <TableRow key={channel.id}>
                    <TableCell className="font-medium">
                      {channel.name}
                    </TableCell>
                    <TableCell>
                      {connections.find(c => c.id === channel.sourceId)?.name}
                    </TableCell>
                    <TableCell>{channel.tableName}</TableCell>
                    <TableCell>{channel.metrics.length} metrics</TableCell>
                    <TableCell>
                      <Badge
                        variant={channel.isActive ? 'default' : 'secondary'}
                      >
                        {channel.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {channel.lastSync?.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // setSelectedChannel(channel);
                            setIsChannelDialogOpen(true);
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
        </TabsContent>
      </Tabs>
    </div>
  );
}