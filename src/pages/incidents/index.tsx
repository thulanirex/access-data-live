import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeSwitch from '@/components/theme-switch';
import { UserNav } from '@/components/user-nav';
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout';
import IssuesByDepartmentChart from './components/IssuesByDepartmentChart';
import ServiceUptimeDowntimeChart from './components/ServiceUptimeDowntimeChart';
import ServiceAvailabilityChart from './components/ServiceAvailabilityChart';
import DashboardTable from './components/DepartmentTable';
import ChannelMetricsTable from './components/ChannelMetricsTable';
import IncidentFrequencyChart from './components/IncidentFrequencyChart';
import IncidentTrendsChart from './components/IncidentTrendsChart';
// import IncidentChart from './components/IncidentChart'; // Component to display various charts
// import IssueTable from './components/IssueTable'; // Table to display issues
// import { incidentData, issueData } from './components/IncidentData'; // Static data for incidents and issues

export default function IncidentDashboard() {
    return (
        <Layout>
            <LayoutHeader>
                <div className='ml-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <UserNav />
                </div>
            </LayoutHeader>

            <LayoutBody className='space-y-4'>
                <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>
                    IT Incident Management Dashboard
                </h1>
                <Tabs orientation='vertical' defaultValue='overview' className='space-y-4'>
                    <TabsList className='bg-custom-orange text-white'>
                        <TabsTrigger value='overview'>Overview</TabsTrigger>
                        <TabsTrigger value='service-performance'>Service Performance</TabsTrigger>
                        <TabsTrigger value='issue-tracking'>Issue Tracking</TabsTrigger>
                    </TabsList>

                    <TabsContent value='overview' className='space-y-4'>
                    <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-2'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Service Availability Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ServiceAvailabilityChart />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Incident Fequency</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <IncidentFrequencyChart />
                            </CardContent>
                        </Card>
                        </div>
                        <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-2'>
                        <Card>
                            <CardHeader>
                                <CardTitle>Incident Trends</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <IncidentTrendsChart />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Incident Fequency</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <IncidentFrequencyChart />
                            </CardContent>
                        </Card>
                        </div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Service Uptime Downtime</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ServiceUptimeDowntimeChart/>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Open/Closed Issues by Department</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <IssuesByDepartmentChart/>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Department Performance Metrics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DashboardTable/>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Channel Performance Metrics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ChannelMetricsTable/>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value='service-performance'>
                        {/* Components to show service uptime/downtime, etc. */}
                    </TabsContent>

                    <TabsContent value='issue-tracking'>
                        {/* Components to manage and track issues */}
                    </TabsContent>
                </Tabs>
            </LayoutBody>
        </Layout>
    );
}
