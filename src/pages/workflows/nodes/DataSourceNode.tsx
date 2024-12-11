import { Handle, Position } from 'reactflow'
import { IconDatabase } from '@tabler/icons-react'
import { Card } from '@/components/ui/card'

interface DataSourceNodeProps {
  data: {
    label: string
    sourceType?: 'database' | 'api' | 'file'
    config?: Record<string, any>
  }
  selected?: boolean
}

export default function DataSourceNode({ data, selected }: DataSourceNodeProps) {
  return (
    <Card
      className={`w-[200px] border-2 ${
        selected ? 'border-primary' : 'border-border'
      }`}
    >
      <div className="flex items-center gap-2 border-b border-border p-2">
        <IconDatabase className="h-4 w-4 text-primary" />
        <div className="flex-1 truncate font-medium">{data.label}</div>
      </div>
      <div className="p-2 text-sm text-muted-foreground">
        {data.sourceType ? (
          <div className="capitalize">{data.sourceType}</div>
        ) : (
          'Configure source type'
        )}
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-primary"
        style={{ right: -4 }}
      />
    </Card>
  )
}