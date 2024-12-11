import {
  IconBrandDocker,
  IconBrandGithub,
  IconBrandGitlab,
  IconBrandSlack,
  IconBrandTrello,
  IconBrandTeams,
  IconBrandAzure,
} from '@tabler/icons-react'

export const apps = [
  {
    name: 'MS Azure',
    logo: <IconBrandAzure />,
    connected: false,
    desc: 'Connect with Azure',
  },
  {
    name: 'Microsoft Teams',
    logo: <IconBrandTeams />,
    connected: false,
    desc: 'Connect with Telegram for real-time communication.',
  },
  {
    name: 'Trello',
    logo: <IconBrandTrello />,
    connected: false,
    desc: 'Sync Trello cards for streamlined project management.',
  },
  {
    name: 'Slack',
    logo: <IconBrandSlack />,
    connected: false,
    desc: 'Integrate Slack for efficient team communication',
  },
 
  {
    name: 'Docker',
    logo: <IconBrandDocker />,
    connected: false,
    desc: 'Effortlessly manage Docker containers on your dashboard.',
  },
  {
    name: 'GitHub',
    logo: <IconBrandGithub />,
    connected: false,
    desc: 'Streamline code management with GitHub integration.',
  },
  {
    name: 'GitLab',
    logo: <IconBrandGitlab />,
    connected: false,
    desc: 'Efficiently manage code projects with GitLab integration.',
  },

]
