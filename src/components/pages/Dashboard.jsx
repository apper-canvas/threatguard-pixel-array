import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import StatCard from '@/components/molecules/StatCard'
import ThreatLevelGauge from '@/components/organisms/ThreatLevelGauge'
import AlertFeed from '@/components/organisms/AlertFeed'
import QuickActions from '@/components/organisms/QuickActions'
import ThreatCard from '@/components/molecules/ThreatCard'
import SkeletonLoader from '@/components/organisms/SkeletonLoader'
import ErrorState from '@/components/organisms/ErrorState'
import { threatService, suspiciousAccountService, alertService } from '@/services'

const Dashboard = () => {
  const [threats, setThreats] = useState([])
  const [accounts, setAccounts] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [threatsData, accountsData, alertsData] = await Promise.all([
        threatService.getAll(),
        suspiciousAccountService.getAll(),
        alertService.getAll()
      ])
      setThreats(threatsData)
      setAccounts(accountsData)
      setAlerts(alertsData)
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const handleQuickAction = async (actionId) => {
    switch (actionId) {
      case 'scan_comments':
        toast.info('Scanning comments for threats...')
        setTimeout(() => toast.success('Comment scan completed'), 2000)
        break
      case 'check_followers':
        toast.info('Analyzing follower patterns...')
        setTimeout(() => toast.success('Follower analysis completed'), 2000)
        break
      case 'add_keyword':
        toast.info('Opening keyword configuration...')
        break
      case 'generate_report':
        toast.info('Generating security report...')
        setTimeout(() => toast.success('Report generated successfully'), 2000)
        break
      case 'settings':
        toast.info('Opening advanced settings...')
        break
      default:
        break
    }
  }

  const handleThreatAction = async (action, threat) => {
    try {
      switch (action) {
        case 'view':
          toast.info(`Viewing details for ${threat.type} threat`)
          break
        case 'resolve':
          await threatService.update(threat.Id, { status: 'resolved' })
          setThreats(prev => prev.map(t => 
            t.Id === threat.Id ? { ...t, status: 'resolved' } : t
          ))
          toast.success('Threat resolved successfully')
          break
        case 'block':
          await threatService.update(threat.Id, { status: 'blocked' })
          setThreats(prev => prev.map(t => 
            t.Id === threat.Id ? { ...t, status: 'blocked' } : t
          ))
          toast.success('Source blocked successfully')
          break
        default:
          break
      }
    } catch (err) {
      toast.error('Failed to perform action')
    }
  }

  // Calculate dashboard statistics
  const activeThreats = threats.filter(t => t.status === 'active')
  const criticalThreats = threats.filter(t => t.severity === 'critical')
  const highRiskAccounts = accounts.filter(a => a.threatScore >= 80)
  const unreadAlerts = alerts.filter(a => !a.isRead)

  // Calculate threat level (0-100)
  const threatLevel = Math.min(
    Math.round(
      (activeThreats.length * 20) + 
      (criticalThreats.length * 30) + 
      (highRiskAccounts.length * 15)
    ),
    100
  )

  const getRecentThreats = () => {
    return threats
      .filter(threat => threat.status === 'active')
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 3)
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonLoader count={4} type="stat" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SkeletonLoader count={3} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Dashboard Unavailable"
          message={error}
          onRetry={loadDashboardData}
        />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Security Dashboard</h1>
        <p className="text-gray-400">
          Monitor and manage your Instagram security threats in real-time
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Threats"
          value={activeThreats.length}
          change={`${activeThreats.length > 5 ? '+' : ''}${activeThreats.length - 3} this week`}
          changeType={activeThreats.length > 5 ? 'negative' : 'positive'}
          icon="Shield"
          color="error"
        />
        <StatCard
          title="Suspicious Accounts"
          value={highRiskAccounts.length}
          change={`${highRiskAccounts.length} high risk`}
          changeType="warning"
          icon="Users"
          color="warning"
        />
        <StatCard
          title="Unread Alerts"
          value={unreadAlerts.length}
          change="Last 24h"
          changeType="neutral"
          icon="Bell"
          color="info"
        />
        <StatCard
          title="Security Score"
          value={`${Math.max(100 - threatLevel, 0)}/100`}
          change={threatLevel > 50 ? 'Needs attention' : 'Good'}
          changeType={threatLevel > 50 ? 'warning' : 'positive'}
          icon="Award"
          color="success"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Level Gauge */}
        <div className="lg:col-span-1">
          <ThreatLevelGauge
            level={threatLevel}
            threats={threats}
          />
        </div>

        {/* Alert Feed */}
        <div className="lg:col-span-2">
          <AlertFeed maxItems={5} />
        </div>
      </div>

      {/* Quick Actions and Recent Threats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions onAction={handleQuickAction} />
        
        {/* Recent Active Threats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-white">Recent Active Threats</h2>
          {getRecentThreats().length > 0 ? (
            <div className="space-y-4">
              {getRecentThreats().map((threat) => (
                <ThreatCard
                  key={threat.Id}
                  threat={threat}
                  onView={(t) => handleThreatAction('view', t)}
                  onResolve={(t) => handleThreatAction('resolve', t)}
                  onBlock={(t) => handleThreatAction('block', t)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-surface-800 border border-surface-600 rounded-lg p-8 text-center">
              <div className="text-success mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">All Clear!</h3>
              <p className="text-gray-400">No active threats detected at this time.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard