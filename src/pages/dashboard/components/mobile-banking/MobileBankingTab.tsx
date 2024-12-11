import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DepositsWithdrawalsChart from './DepositsWithdrawalsChart';
import SuccessFailurePieChart from './SuccessFailurePieChart';
import SalesVolumeValueChart from './SalesVolumeValueChart';
// import NewCustomerRegistrationsChart from './NewCustomerRegistrationsChart';
import FeatureUsageRadarChart from './FeatureUsageRadarChart';

const MobileBankingTab = () => {
  return (
    <div className='grid grid-cols-2 gap-4 lg:grid-cols-2'>
      {/* Each card will follow the layout and style similar to the Overview tab */}
      <Card className=''>
        <CardHeader>
          <CardTitle>Debit vs Credit</CardTitle>
        </CardHeader>
        <CardContent>
          <DepositsWithdrawalsChart />
        </CardContent>
      </Card>
      <Card className=''>
        <CardHeader>
          <CardTitle>Success Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <SuccessFailurePieChart />
        </CardContent>
      </Card>
      {/* Repeat for other charts ensuring styling consistency */}
      <Card className=''>
        <CardHeader>
          <CardTitle>Sales Volume vs Value</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesVolumeValueChart />
        </CardContent>
      </Card>
      <Card className=''>
        <CardHeader>
          <CardTitle>Feature Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <FeatureUsageRadarChart />
        </CardContent>
      </Card>
      {/* <Card className=''>
        <CardHeader>
          <CardTitle>New Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <NewCustomerRegistrationsChart />
        </CardContent>
      </Card> */}

    </div>
  );
};

export default MobileBankingTab;
