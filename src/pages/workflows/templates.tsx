import { useNavigate } from 'react-router-dom'
import {
  IconDatabase,
  IconFileAnalytics,
  IconReportAnalytics,
  IconTableExport,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const templates = [
  {
    id: 'data-sync',
    title: 'Database Sync',
    description: 'Synchronize data between two databases with transformation',
    icon: <IconDatabase className="h-12 w-12 text-primary" />,
    nodes: [
      {
        id: 'source-1',
        type: 'dataSource',
        position: { x: 100, y: 100 },
        data: { label: 'Source Database', sourceType: 'database' },
      },
      {
        id: 'transform-1',
        type: 'transform',
        position: { x: 400, y: 100 },
        data: { label: 'Data Transform', transformType: 'map' },
      },
      {
        id: 'destination-1',
        type: 'destination',
        position: { x: 700, y: 100 },
        data: { label: 'Target Database', destinationType: 'database' },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'source-1', target: 'transform-1' },
      { id: 'e2-3', source: 'transform-1', target: 'destination-1' },
    ],
  },
  {
    id: 'data-warehouse',
    title: 'Data Warehouse ETL',
    description: 'Extract, transform, and load data into a data warehouse',
    icon: <IconFileAnalytics className="h-12 w-12 text-primary" />,
    nodes: [
      {
        id: 'source-1',
        type: 'dataSource',
        position: { x: 100, y: 100 },
        data: { label: 'Source Database', sourceType: 'database' },
      },
      {
        id: 'transform-1',
        type: 'transform',
        position: { x: 400, y: 100 },
        data: { label: 'Clean Data', transformType: 'filter' },
      },
      {
        id: 'transform-2',
        type: 'transform',
        position: { x: 400, y: 250 },
        data: { label: 'Aggregate Data', transformType: 'aggregate' },
      },
      {
        id: 'destination-1',
        type: 'destination',
        position: { x: 700, y: 175 },
        data: { label: 'Data Warehouse', destinationType: 'database' },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'source-1', target: 'transform-1' },
      { id: 'e1-3', source: 'source-1', target: 'transform-2' },
      { id: 'e2-4', source: 'transform-1', target: 'destination-1' },
      { id: 'e3-4', source: 'transform-2', target: 'destination-1' },
    ],
  },
  {
    id: 'api-integration',
    title: 'API Integration',
    description: 'Connect and transform data from external APIs',
    icon: <IconTableExport className="h-12 w-12 text-primary" />,
    nodes: [
      {
        id: 'source-1',
        type: 'dataSource',
        position: { x: 100, y: 100 },
        data: { label: 'External API', sourceType: 'api' },
      },
      {
        id: 'transform-1',
        type: 'transform',
        position: { x: 400, y: 100 },
        data: { label: 'Transform Response', transformType: 'map' },
      },
      {
        id: 'destination-1',
        type: 'destination',
        position: { x: 700, y: 100 },
        data: { label: 'Local Database', destinationType: 'database' },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'source-1', target: 'transform-1' },
      { id: 'e2-3', source: 'transform-1', target: 'destination-1' },
    ],
  },
  {
    id: 'reporting',
    title: 'Reporting Pipeline',
    description: 'Prepare and transform data for reporting',
    icon: <IconReportAnalytics className="h-12 w-12 text-primary" />,
    nodes: [
      {
        id: 'source-1',
        type: 'dataSource',
        position: { x: 100, y: 100 },
        data: { label: 'Data Source', sourceType: 'database' },
      },
      {
        id: 'transform-1',
        type: 'transform',
        position: { x: 400, y: 100 },
        data: { label: 'Filter Data', transformType: 'filter' },
      },
      {
        id: 'transform-2',
        type: 'transform',
        position: { x: 400, y: 250 },
        data: { label: 'Create Metrics', transformType: 'aggregate' },
      },
      {
        id: 'destination-1',
        type: 'destination',
        position: { x: 700, y: 175 },
        data: { label: 'Report Output', destinationType: 'file' },
      },
    ],
    edges: [
      { id: 'e1-2', source: 'source-1', target: 'transform-1' },
      { id: 'e1-3', source: 'source-1', target: 'transform-2' },
      { id: 'e2-4', source: 'transform-1', target: 'destination-1' },
      { id: 'e3-4', source: 'transform-2', target: 'destination-1' },
    ],
  },
]

export default function TemplatesPage() {
  const navigate = useNavigate()

  const handleTemplateClick = (template: typeof templates[0]) => {
    // Navigate to builder with template data
    navigate('/workflows/builder', {
      state: {
        template: {
          nodes: template.nodes,
          edges: template.edges,
        },
      },
    })
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {templates.map((template) => (
        <Card key={template.id} className="flex flex-col">
          <CardHeader>
            <div className="mb-4 flex justify-center">{template.icon}</div>
            <CardTitle>{template.title}</CardTitle>
            <CardDescription>{template.description}</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Button
              className="w-full"
              onClick={() => handleTemplateClick(template)}
            >
              Use Template
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}