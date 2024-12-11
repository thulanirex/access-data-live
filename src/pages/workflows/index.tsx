import { Outlet, useNavigate } from 'react-router-dom'
import { IconPlus, IconTemplate } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { Search } from '@/components/search'
import { UserNav } from '@/components/user-nav'
import ThemeSwitch from '@/components/theme-switch'

export default function WorkflowsPage() {
  const navigate = useNavigate()

  return (
    <Layout fadedBelow fixedHeight>
      <LayoutHeader>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      <LayoutBody className="flex flex-col space-y-6" fixedHeight>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Workflows
            </h1>
            <p className="text-muted-foreground">
              Build and manage your data pipelines with our visual workflow builder.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/workflows/templates')}
            >
              <IconTemplate className="mr-2 h-4 w-4" />
              Templates
            </Button>
            <Button onClick={() => navigate('/workflows/builder')}>
              <IconPlus className="mr-2 h-4 w-4" />
              New Workflow
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </LayoutBody>
    </Layout>
  )
}