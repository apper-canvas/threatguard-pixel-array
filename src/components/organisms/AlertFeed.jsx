import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import AlertItem from '@/components/molecules/AlertItem'
import { alertService } from '@/services'

const AlertFeed = ({ maxItems = 5, showHeader = true }) => {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadAlerts = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await alertService.getAll()
      const sortedAlerts = result
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, maxItems)
      setAlerts(sortedAlerts)
    } catch (err) {
      setError(err.message || 'Failed to load alerts')
      toast.error('Failed to load alerts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAlerts()
  }, [maxItems])

  const handleMarkAsRead = async (alert) => {
    try {
      await alertService.markAsRead(alert.Id)
      setAlerts(prevAlerts =>
        prevAlerts.map(a =>
          a.Id === alert.Id ? { ...a, isRead: true } : a
        )
      )
      toast.success('Alert marked as read')
    } catch (err) {
      toast.error('Failed to mark alert as read')
    }
  }

  const handleAlertClick = (alert) => {
    if (!alert.isRead) {
      handleMarkAsRead(alert)
    }
  }

  const unreadCount = alerts.filter(alert => !alert.isRead).length

  if (loading) {
    return (
      <Card>
        {showHeader && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Alerts</h2>
          </div>
        )}
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start p-3 bg-surface-700 rounded-lg">
                <div className="w-8 h-8 bg-surface-600 rounded-lg mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-surface-600 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-surface-600 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        {showHeader && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Alerts</h2>
          </div>
        )}
        <div className="text-center py-8">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <p className="text-error mb-4">{error}</p>
          <Button onClick={loadAlerts} variant="outline" size="small">
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  if (alerts.length === 0) {
    return (
      <Card>
        {showHeader && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Alerts</h2>
          </div>
        )}
        <div className="text-center py-8">
          <ApperIcon name="Bell" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No alerts yet</h3>
          <p className="text-gray-400">
            You'll see security alerts and notifications here when they occur.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-white">Recent Alerts</h2>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-error rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="small"
            icon="RotateCcw"
            onClick={loadAlerts}
          >
            Refresh
          </Button>
        </div>
      )}

      <div className="space-y-2">
        <AnimatePresence>
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <AlertItem
                alert={alert}
                onClick={handleAlertClick}
                onMarkRead={handleMarkAsRead}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {alerts.length >= maxItems && (
        <div className="mt-4 text-center">
          <Button variant="ghost" size="small" icon="ArrowRight">
            View All Alerts
          </Button>
        </div>
      )}
    </Card>
  )
}

export default AlertFeed