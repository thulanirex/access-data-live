import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import DashboardTable from './components/DashboardTable'
import MobileTab from './components/mobile/MobileTab'
import { DateRangePicker } from './components/DateRangePicker'
import AccessPayTab from './components/accesspay/AccessPayTab'
import {LiveStats} from './components/LiveStats'
import TengaTab from './components/tenga/TengaTab'
import NFSTab from './components/nfs/NFSTab'
import USSDTab from './components/ussd/USSDTab'

export default function Dashboard() {

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <LayoutHeader>
        {/* <TopNav links={topNav} /> */}
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>

      {/* ===== Main ===== */}
      <LayoutBody className='space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
            Bank Channel Analytics
          </h1>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview' 
          className='space-y-4'
        >
          <div className='w-full pb-2'>
            <TabsList className='bg-custom-orange text-white'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='ussd'>USSD *801#</TabsTrigger>
              <TabsTrigger value='nfs'>NFS</TabsTrigger>
              <TabsTrigger value='mobile-banking'>Mobile Banking</TabsTrigger>
              <TabsTrigger value='tenga'>Tenga</TabsTrigger>
              <TabsTrigger value='accesspay'>Access Pay</TabsTrigger>
            </TabsList>
            <DateRangePicker />

          </div>
          <TabsContent value='overview'>
            <LiveStats />
          </TabsContent>
          {/* <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Live Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <LiveStats />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Channel Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                 <DashboardTable />
                </CardContent>
              </Card>
          
            </div>
          </TabsContent> */}
          <TabsContent value='mobile-banking'>
            <MobileTab />
          </TabsContent>
          <TabsContent value='accesspay'>
            <AccessPayTab /> 
          </TabsContent>
          <TabsContent value='tenga'>
            <TengaTab />
          </TabsContent>
          <TabsContent value='nfs'>
            <NFSTab />
          </TabsContent>
          <TabsContent value='ussd'>
            <USSDTab />
          </TabsContent>
        </Tabs>
      </LayoutBody>
    </Layout>
  )
}
