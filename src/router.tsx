import { createBrowserRouter } from 'react-router-dom'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'
import React, { Suspense } from 'react'
import AiAssistant from './pages/ai-assistant'

// Add a loading component
const Loading = () => <div>Loading...</div>

// Lazy load components
const SignIn = React.lazy(() => import('./pages/auth/sign-in'))
const SignIn2 = React.lazy(() => import('./pages/auth/sign-in-2'))
const SignUp = React.lazy(() => import('./pages/auth/sign-up'))
const ForgotPassword = React.lazy(() => import('./pages/auth/forgot-password'))
const Otp = React.lazy(() => import('./pages/auth/otp'))
const AppShell = React.lazy(() => import('./components/app-shell'))
const Dashboard = React.lazy(() => import('./pages/dashboard'))
const Incidents = React.lazy(() => import('./pages/incidents'))
const Tasks = React.lazy(() => import('@/pages/tasks'))
const Reports = React.lazy(() => import('./pages/reports'))
const DashboardBuilder = React.lazy(() => import('./pages/dashboard-builder'))
const Workflows = React.lazy(() => import('./pages/workflows'))
const WorkflowsBuilder = React.lazy(() => import('./pages/workflows/builder'))
const WorkflowsTemplates = React.lazy(() => import('./pages/workflows/templates'))
const ComingSoon = React.lazy(() => import('@/components/coming-soon'))
const Apps = React.lazy(() => import('@/pages/apps'))
const ExtraComponents = React.lazy(() => import('@/pages/extra-components'))
const Settings = React.lazy(() => import('./pages/settings'))
const SettingsProfile = React.lazy(() => import('./pages/settings/profile'))
const SettingsDataSources = React.lazy(() => import('./pages/settings/data-sources'))
const SettingsIntegrations = React.lazy(() => import('./pages/settings/integrations'))
const SettingsAccount = React.lazy(() => import('./pages/settings/account'))
const SettingsAppearance = React.lazy(() => import('./pages/settings/appearance'))
const SettingsNotifications = React.lazy(() => import('./pages/settings/notifications'))
const SettingsDisplay = React.lazy(() => import('./pages/settings/display'))
const SettingsErrorExample = React.lazy(() => import('./pages/settings/error-example'))

const router = createBrowserRouter(
  [
    // Auth routes
    {
      path: '/sign-in',
      element: (
        <Suspense fallback={<Loading />}>
          <SignIn />
        </Suspense>
      ),
      errorElement: <GeneralError />,
    },
    {
      path: '/sign-in-2',
      element: (
        <Suspense fallback={<Loading />}>
          <SignIn2 />
        </Suspense>
      ),
      errorElement: <GeneralError />,
    },
    {
      path: '/sign-up',
      element: (
        <Suspense fallback={<Loading />}>
          <SignUp />
        </Suspense>
      ),
      errorElement: <GeneralError />,
    },
    {
      path: '/forgot-password',
      element: (
        <Suspense fallback={<Loading />}>
          <ForgotPassword />
        </Suspense>
      ),
      errorElement: <GeneralError />,
    },
    {
      path: '/otp',
      element: (
        <Suspense fallback={<Loading />}>
          <Otp />
        </Suspense>
      ),
      errorElement: <GeneralError />,
    },

    // Main routes
    {
      path: '/',
      element: (
        <Suspense fallback={<Loading />}>
          <AppShell />
        </Suspense>
      ),
      errorElement: <GeneralError />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<Loading />}>
              <Dashboard />
            </Suspense>
          ),
        },
        {
          path: 'ai-assistant',
          element: (
            <Suspense fallback={<Loading />}>
              < AiAssistant />
            </Suspense>
          ),
        },
        {
          path: 'incidents',
          element: (
            <Suspense fallback={<Loading />}>
              <Incidents />
            </Suspense>
          ),
          errorElement: <GeneralError />,
        },
        {
          path: 'tasks',
          element: (
            <Suspense fallback={<Loading />}>
              <Tasks />
            </Suspense>
          ),
        },
        {
          path: 'reports',
          element: (
            <Suspense fallback={<Loading />}>
              <Reports />
            </Suspense>
          ),
        },
        {
          path: 'dashboard-builder',
          element: (
            <Suspense fallback={<Loading />}>
              <DashboardBuilder />
            </Suspense>
          ),
        },
        {
          path: 'workflows',
          element: (
            <Suspense fallback={<Loading />}>
              <Workflows />
            </Suspense>
          ),
          children: [
            {
              index: true,
              element: (
                <Suspense fallback={<Loading />}>
                  <WorkflowsBuilder />
                </Suspense>
              ),
            },
            {
              path: 'builder',
              element: (
                <Suspense fallback={<Loading />}>
                  <WorkflowsBuilder />
                </Suspense>
              ),
            },
            {
              path: 'templates',
              element: (
                <Suspense fallback={<Loading />}>
                  <WorkflowsTemplates />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: 'chats',
          element: (
            <Suspense fallback={<Loading />}>
              <ComingSoon />
            </Suspense>
          ),
        },
        {
          path: 'apps',
          element: (
            <Suspense fallback={<Loading />}>
              <Apps />
            </Suspense>
          ),
        },
        {
          path: 'users',
          element: (
            <Suspense fallback={<Loading />}>
              <ComingSoon />
            </Suspense>
          ),
        },
        {
          path: 'analysis',
          element: (
            <Suspense fallback={<Loading />}>
              <ComingSoon />
            </Suspense>
          ),
        },
        {
          path: 'extra-components',
          element: (
            <Suspense fallback={<Loading />}>
              <ExtraComponents />
            </Suspense>
          ),
        },
        {
          path: 'settings',
          element: (
            <Suspense fallback={<Loading />}>
              <Settings />
            </Suspense>
          ),
          errorElement: <GeneralError />,
          children: [
            {
              index: true,
              element: (
                <Suspense fallback={<Loading />}>
                  <SettingsProfile />
                </Suspense>
              ),
            },
            {
              path: 'data-sources',
              element: (
                <Suspense fallback={<Loading />}>
                  <SettingsDataSources />
                </Suspense>
              ),
            },
            {
              path: 'integrations',
              element: (
                <Suspense fallback={<Loading />}>
                  <SettingsIntegrations />
                </Suspense>
              ),
            },
            {
              path: 'account',
              element: (
                <Suspense fallback={<Loading />}>
                  <SettingsAccount />
                </Suspense>
              ),
            },
            {
              path: 'appearance',
              element: (
                <Suspense fallback={<Loading />}>
                  <SettingsAppearance />
                </Suspense>
              ),
            },
            {
              path: 'notifications',
              element: (
                <Suspense fallback={<Loading />}>
                  <SettingsNotifications />
                </Suspense>
              ),
            },
            {
              path: 'display',
              element: (
                <Suspense fallback={<Loading />}>
                  <SettingsDisplay />
                </Suspense>
              ),
            },
            {
              path: 'reports',
              element: (
                <Suspense fallback={<Loading />}>
                  <Reports />
                </Suspense>
              ),
            },
            {
              path: 'error-example',
              element: (
                <Suspense fallback={<Loading />}>
                  <SettingsErrorExample />
                </Suspense>
              ),
              errorElement: <GeneralError className='h-[50svh]' minimal />,
            },
          ],
        },
      ],
    },

    // Error routes
    { path: '/500', element: <GeneralError /> },
    { path: '/404', element: <NotFoundError /> },
    { path: '/503', element: <MaintenanceError /> },

    // Fallback 404 route
    { path: '*', element: <NotFoundError /> },
  ],
  {
    basename: '/',
  }
)

export default router
