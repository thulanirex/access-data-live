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
import BillersChart from './components/BillersChart'
import { billersData } from './components/BillersData';
import MobileBankingTab from './components/mobile-banking/MobileBankingTab'
import { DateRangePicker } from './components/DateRangePicker'
import {ObdxTab} from './components/obdx/ObdxTab'
import ATMData from './components/atm/ATMData'
import AccessPayTab from './access-pay/AccessPayTab'
import LiveStats from './components/LiveStats'

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
              <TabsTrigger value='atm'>ATM</TabsTrigger>
              <TabsTrigger value='accesspay'>Access Pay</TabsTrigger>
              <TabsTrigger value='mobile-banking'>Mobile Banking</TabsTrigger>
              <TabsTrigger value='internet-banking'>Internet Banking</TabsTrigger>
              <TabsTrigger value='tenga'>Tenga</TabsTrigger>
              <TabsTrigger value='pos'>POS</TabsTrigger>
              <TabsTrigger value='visa'>E-commerce (Visa)</TabsTrigger>
              <TabsTrigger value='nfs'>NFS</TabsTrigger>
              <TabsTrigger value='obdx'>OBDX</TabsTrigger>
              <TabsTrigger value='sme-app'>SME APP</TabsTrigger>
            </TabsList>
            <DateRangePicker />

          </div>
          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {/* <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 bg-custom-green'>
                  <CardTitle className='text-sm font-medium'>
                    Transaction Count
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4'
                  >
                    <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>37,993</div>
                  <p className='text-xs text-muted-foreground'>
                    +32.78% from yesterday
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 bg-custom-green'>
                  <CardTitle className='text-sm font-medium'>
                    Channel Success Rate (Average)
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
                    <circle cx='9' cy='7' r='4' />
                    <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>89.57%</div>
                  <p className='text-xs text-muted-foreground'>
                    +1.1% from yesterday
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 bg-custom-green'>
                  <CardTitle className='text-sm font-medium'>Wallet Transactions Count</CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <rect width='20' height='14' x='2' y='5' rx='2' />
                    <path d='M2 10h20' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+2890</div>
                  <p className='text-xs text-muted-foreground'>
                    -500 from yesterday
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 bg-custom-green'>
                  <CardTitle className='text-sm font-medium'>
                    New Customers
                  </CardTitle>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='h-4 w-4 text-muted-foreground'
                  >
                    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>+236</div>
                  <p className='text-xs text-muted-foreground'>
                    +110 since yesterday
                  </p>
                </CardContent>
              </Card> */}
            </div>
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Live Stats</CardTitle>
                </CardHeader>
                {/* <CardContent className='pl-2'>
                  <BillersChart data={billersData} />
                </CardContent> */}
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
          </TabsContent>
          <TabsContent value='atm'>
            <ATMData/>
          </TabsContent>
          <TabsContent value='mobile-banking'>
            <MobileBankingTab />
          </TabsContent>
          <TabsContent value='obdx'>
            <ObdxTab />
          </TabsContent>
          <TabsContent value='accesspay'>
            <AccessPayTab /> 
          </TabsContent>
        </Tabs>
      </LayoutBody>
    </Layout>
  )
}
