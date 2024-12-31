import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ThemeSwitch from '@/components/theme-switch'
// import { UserNav } from '@/components/user-nav'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import MobileTab from './components/mobile/MobileTab'
import AccessPayTab from './components/accesspay/AccessPayTab'
import {LiveStats} from './components/LiveStats'
import TengaTab from './components/tenga/TengaTab'
import NFSTab from './components/nfs/NFSTab'
import USSDTab from './components/ussd/USSDTab'
import USSD202Tab  from './components/ussd202/USSD202Tab'
import { RIBTab } from './components/rib/RIBTab'
import ATMTab from './components/atm/ATMTab'
import AgencyBankingTab from './components/agency/AgencyBankingTab'
import USSD360Tab from './components/ussd360/USSD360Tab'

export default function Dashboard() {

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      {/* <LayoutHeader>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
        </div>
      </LayoutHeader> */}

      {/* ===== Main ===== */}
      <LayoutBody className='space-y-4'>
        <div className='flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
           Access Bank - Channel Analytics
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
              <TabsTrigger value='ussd202'>USSD *202#</TabsTrigger>
              <TabsTrigger value='ussd360'>USSD *360#</TabsTrigger>
              <TabsTrigger value='nfs'>NFS</TabsTrigger>
              <TabsTrigger value='mobile-banking'>Mobile Banking</TabsTrigger>
              <TabsTrigger value='agency'>Agency Banking</TabsTrigger>
              <TabsTrigger value='rib'>Retail Internet Banking</TabsTrigger>
              <TabsTrigger value='tenga'>Tenga</TabsTrigger>
              <TabsTrigger value='atm'>ATM Transactions</TabsTrigger>
              <TabsTrigger value='accesspay'>Access Pay</TabsTrigger>
            </TabsList>

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
          <TabsContent value='rib'>
            <RIBTab />
          </TabsContent>
          <TabsContent value='ussd'>
            <USSDTab />
          </TabsContent>
          <TabsContent value='ussd202'>
            <USSD202Tab />
          </TabsContent>
          <TabsContent value='ussd360'>
            <USSD360Tab />
          </TabsContent>
          <TabsContent value='atm'>
            <ATMTab />
          </TabsContent>
          <TabsContent value='agency'>
            < AgencyBankingTab />
          </TabsContent>

        </Tabs>
      </LayoutBody>
    </Layout>
  )
}
