import Dashboard from '@/components/pages/Dashboard'
import Threats from '@/components/pages/Threats'
import Accounts from '@/components/pages/Accounts'
import Keywords from '@/components/pages/Keywords'
import Timeline from '@/components/pages/Timeline'
import Settings from '@/components/pages/Settings'

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  threats: {
    id: 'threats',
    label: 'Threats',
    path: '/threats',
    icon: 'Shield',
    component: Threats
  },
  accounts: {
    id: 'accounts',
    label: 'Accounts',
    path: '/accounts',
    icon: 'Users',
    component: Accounts
  },
  keywords: {
    id: 'keywords',
    label: 'Keywords',
    path: '/keywords',
    icon: 'Search',
    component: Keywords
  },
  timeline: {
    id: 'timeline',
    label: 'Timeline',
    path: '/timeline',
    icon: 'Clock',
    component: Timeline
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
}

export const routeArray = Object.values(routes)
export default routes