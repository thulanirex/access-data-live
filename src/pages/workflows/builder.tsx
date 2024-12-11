import { useCallback, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  ConnectionMode,
  Controls,
  Edge,
  Node,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DataSourceNode from './nodes/DataSourceNode'
import TransformNode from './nodes/TransformNode'
import DestinationNode from './nodes/DestinationNode'

const nodeTypes = {
  dataSource: DataSourceNode,
  transform: TransformNode,
  destination: DestinationNode,
}

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

export default function WorkflowBuilder() {
  const location = useLocation()
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  // Load template data if available
  useEffect(() => {
    const template = location.state?.template
    if (template) {
      setNodes(template.nodes)
      setEdges(template.edges)
    }
  }, [location.state, setNodes, setEdges])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node)
    },
    [setSelectedNode],
  )

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${type}-${nodes.length + 1}`,
      type,
      position: { x: 100, y: 100 },
      data: { label: `New ${type}` },
    }
    setNodes((nds) => [...nds, newNode])
  }

  return (
    <div className="grid h-full grid-cols-[300px_1fr_300px] gap-4">
      {/* Left Sidebar - Node Types */}
      <Card className="p-4">
        <h3 className="mb-4 font-semibold">Components</h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => addNode('dataSource')}
          >
            Data Source
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => addNode('transform')}
          >
            Transform
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => addNode('destination')}
          >
            Destination
          </Button>
        </div>
      </Card>

      {/* Flow Canvas */}
      <Card className="overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </Card>

      {/* Right Sidebar - Node Properties */}
      <Card className="p-4">
        <h3 className="mb-4 font-semibold">Properties</h3>
        {selectedNode ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={selectedNode.data.label}
                onChange={(e) => {
                  setNodes((nds) =>
                    nds.map((n) =>
                      n.id === selectedNode.id
                        ? { ...n, data: { ...n.data, label: e.target.value } }
                        : n,
                    ),
                  )
                }}
              />
            </div>

            <Tabs defaultValue="settings">
              <TabsList className="w-full">
                <TabsTrigger value="settings" className="flex-1">
                  Settings
                </TabsTrigger>
                <TabsTrigger value="style" className="flex-1">
                  Style
                </TabsTrigger>
              </TabsList>
              <TabsContent value="settings">
                <div className="space-y-4">
                  {selectedNode.type === 'dataSource' && (
                    <>
                      <div className="space-y-2">
                        <Label>Source Type</Label>
                        <Select
                          value={selectedNode.data.sourceType}
                          onValueChange={(value) => {
                            setNodes((nds) =>
                              nds.map((n) =>
                                n.id === selectedNode.id
                                  ? {
                                      ...n,
                                      data: { ...n.data, sourceType: value },
                                    }
                                  : n,
                              ),
                            )
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="database">Database</SelectItem>
                            <SelectItem value="api">API</SelectItem>
                            <SelectItem value="file">File</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {selectedNode.type === 'transform' && (
                    <>
                      <div className="space-y-2">
                        <Label>Transform Type</Label>
                        <Select
                          value={selectedNode.data.transformType}
                          onValueChange={(value) => {
                            setNodes((nds) =>
                              nds.map((n) =>
                                n.id === selectedNode.id
                                  ? {
                                      ...n,
                                      data: { ...n.data, transformType: value },
                                    }
                                  : n,
                              ),
                            )
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select transform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="filter">Filter</SelectItem>
                            <SelectItem value="map">Map</SelectItem>
                            <SelectItem value="aggregate">Aggregate</SelectItem>
                            <SelectItem value="join">Join</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {selectedNode.type === 'destination' && (
                    <>
                      <div className="space-y-2">
                        <Label>Destination Type</Label>
                        <Select
                          value={selectedNode.data.destinationType}
                          onValueChange={(value) => {
                            setNodes((nds) =>
                              nds.map((n) =>
                                n.id === selectedNode.id
                                  ? {
                                      ...n,
                                      data: { ...n.data, destinationType: value },
                                    }
                                  : n,
                              ),
                            )
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select destination" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="database">Database</SelectItem>
                            <SelectItem value="api">API</SelectItem>
                            <SelectItem value="file">File</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="style">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <Input type="color" />
                  </div>
                  <div className="space-y-2">
                    <Label>Border Color</Label>
                    <Input type="color" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Select a node to view its properties
          </p>
        )}
      </Card>
    </div>
  )
}