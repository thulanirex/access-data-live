import {
  IconApps,
  IconArrowFork,
  IconChecklist,
  IconLayoutDashboard,
  IconMessages,
  IconSettings,
} from '@tabler/icons-react'

export interface NavLink {
  title: string
  label?: string
  href: string
  icon: JSX.Element
}

export interface SideLink extends NavLink {
  sub?: NavLink[]
}

export const sidelinks: SideLink[] = [
  {
    title: 'Channel Data Analytics',
    label: '',
    href: '/',
    icon: <IconLayoutDashboard size={18} />,
  },
  {
    title: 'Service Management Dashboard',
    label: '',
    href: '/incidents',
    icon: <IconChecklist size={18} />,
  },
  {
    title: 'Reporting',
    label: '',
    href: '/reports',
    icon: <IconChecklist size={18} />,
  },
  
  {
    title: 'AI Assistant',
    label: '',
    href: '/ai-assistant',
    icon: <IconMessages size={18} />,
  },
  {
    title: 'Dashboard Builder',
    label: '',
    href: '/dashboard-builder',
    icon: <IconSettings size={18} />,
  },
    {
    title: 'Workflows',
    label: '',
    href: '/workflows',
    icon: <IconArrowFork size={18} />,
  },
  {
    title: 'Apps',
    label: '',
    href: '/apps',
    icon: <IconApps size={18} />,
  },
  // {
  //   title: 'Authentication',
  //   label: '',
  //   href: '',
  //   icon: <IconUserShield size={18} />,
  //   sub: [
  //     {
  //       title: 'Sign In (email + password)',
  //       label: '',
  //       href: '/sign-in',
  //       icon: <IconHexagonNumber1 size={18} />,
  //     },
  //     {
  //       title: 'Sign In (Box)',
  //       label: '',
  //       href: '/sign-in-2',
  //       icon: <IconHexagonNumber2 size={18} />,
  //     },
  //     {
  //       title: 'Sign Up',
  //       label: '',
  //       href: '/sign-up',
  //       icon: <IconHexagonNumber3 size={18} />,
  //     },
  //     {
  //       title: 'Forgot Password',
  //       label: '',
  //       href: '/forgot-password',
  //       icon: <IconHexagonNumber4 size={18} />,
  //     },
  //     {
  //       title: 'OTP',
  //       label: '',
  //       href: '/otp',
  //       icon: <IconHexagonNumber5 size={18} />,
  //     },
  //   ],
  // },
  // {
  //   title: 'Users',
  //   label: '',
  //   href: '/users',
  //   icon: <IconUsers size={18} />,
  // },
  // {
  //   title: 'Requests',
  //   label: '10',
  //   href: '/requests',
  //   icon: <IconRouteAltLeft size={18} />,
  //   sub: [
  //     {
  //       title: 'Trucks',
  //       label: '9',
  //       href: '/trucks',
  //       icon: <IconTruck size={18} />,
  //     },
  //     {
  //       title: 'Cargos',
  //       label: '',
  //       href: '/cargos',
  //       icon: <IconBoxSeam size={18} />,
  //     },
  //   ],
  // },
  // {
  //   title: 'Analysis',
  //   label: '',
  //   href: '/analysis',
  //   icon: <IconChartHistogram size={18} />,
  // },
  // {
  //   title: 'Extra Components',
  //   label: '',
  //   href: '/extra-components',
  //   icon: <IconComponents size={18} />,
  // },
  // {
  //   title: 'Error Pages',
  //   label: '',
  //   href: '',
  //   icon: <IconExclamationCircle size={18} />,
  //   sub: [
  //     {
  //       title: 'Not Found',
  //       label: '',
  //       href: '/404',
  //       icon: <IconError404 size={18} />,
  //     },
  //     {
  //       title: 'Internal Server Error',
  //       label: '',
  //       href: '/500',
  //       icon: <IconServerOff size={18} />,
  //     },
  //     {
  //       title: 'Maintenance Error',
  //       label: '',
  //       href: '/503',
  //       icon: <IconBarrierBlock size={18} />,
  //     },
  //   ],
  // },
  {
    title: 'Settings',
    label: '',
    href: '/settings',
    icon: <IconSettings size={18} />,
  },
]
