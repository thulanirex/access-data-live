import { Handle, Position } from 'reactflow'
import { IconBox } from '@tabler/icons-react'
import { Card } from '@/components/ui/card'

interface DestinationNodeProps {
  data: {
    label: string
    destinationType?: 'database' | 'api' | 'file'
    config?: Record<string, any>
  }
  selected?: boolean
}

export default function DestinationNode({ data, selected }: DestinationNodeProps) {
  return (
    <Card
      className={`w-[200px] border-2 ${
        selected ? 'border-primary' : 'border-border'
      }`}
    >
      <div className="flex items-center gap-2 border-b border-border p-2">
        <IconBox className="h-4 w-4 text-primary" />
        <div className="flex-1 truncate font-medium">{data.label}</div>
      </div>
      <div className="p-2 text-sm text-muted-foreground">
        {data.destinationType ? (
          <div className="capitalize">{data.destinationType}</div>
        ) : (
          'Configure destination type'
        )}
      </div>

      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-primary"
        style={{ left: -4 }}
      />
    </Card>
  )
}