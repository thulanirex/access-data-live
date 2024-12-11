import { Handle, Position } from 'reactflow'
import { IconWand } from '@tabler/icons-react'
import { Card } from '@/components/ui/card'

interface TransformNodeProps {
  data: {
    label: string
    transformType?: 'filter' | 'map' | 'aggregate' | 'join'
    config?: Record<string, any>
  }
  selected?: boolean
}

export default function TransformNode({ data, selected }: TransformNodeProps) {
  return (
    <Card
      className={`w-[200px] border-2 ${
        selected ? 'border-primary' : 'border-border'
      }`}
    >
      <div className="flex items-center gap-2 border-b border-border p-2">
        <IconWand className="h-4 w-4 text-primary" />
        <div className="flex-1 truncate font-medium">{data.label}</div>
      </div>
      <div className="p-2 text-sm text-muted-foreground">
        {data.transformType ? (
          <div className="capitalize">{data.transformType}</div>
        ) : (
          'Configure transform type'
        )}
      </div>

      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-primary"
        style={{ left: -4 }}
      />

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