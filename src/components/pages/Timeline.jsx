import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, isToday, isYesterday, subDays } from 'date-fns'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import SkeletonLoader from '@/components/organisms/SkeletonLoader'
import ErrorState from '@/components/organisms/ErrorState'
import EmptyState from '@/components/organisms/EmptyState'
import { threatService, alertService } from '@/services'

const Timeline = () => {
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEventType, setSelectedEventType] = useState('')
  const [selectedTimeRange, setSelectedTimeRange] = useState('all')

  const loadTimelineData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [threats, alerts] = await Promise.all([
        threatService.getAll(),
        alertService.getAll()
      ])

      // Combine and format events
      const combinedEvents = [
        ...threats.map(threat => ({
          ...threat,
          eventType: 'threat',
          eventTime: threat.timestamp,
          title: `${threat.type.replace('_', ' ')} threat detected`,
          description: threat.content,
          severity: threat.severity,
          source: threat.source
        })),
        ...alerts.map(alert => ({
          ...alert,
          eventType: 'alert',
          eventTime: alert.createdAt,
          title: alert.message,
          description: `Priority: ${alert.priority}`,
          severity: alert.priority,
          isRead: alert.isRead
        }))
      ]

      // Sort by most recent first
      const sortedEvents = combinedEvents.sort((a, b) => 
        new Date(b.eventTime) - new Date(a.eventTime)
      )

      setEvents(sortedEvents)
      setFilteredEvents(sortedEvents)
    } catch (err) {
      setError(err.message || 'Failed to load timeline data')
      toast.error('Failed to load timeline data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTimelineData()
  }, [])

  useEffect(() => {
    let filtered = events

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.source && event.source.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by event type
    if (selectedEventType) {
      filtered = filtered.filter(event => event.eventType === selectedEventType)
    }

    // Filter by time range
    if (selectedTimeRange !== 'all') {
      const now = new Date()
      let cutoffDate

      switch (selectedTimeRange) {
        case 'today':
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          cutoffDate = subDays(now, 7)
          break
        case 'month':
          cutoffDate = subDays(now, 30)
          break
        default:
          cutoffDate = null
      }

      if (cutoffDate) {
        filtered = filtered.filter(event => 
          new Date(event.eventTime) >= cutoffDate
        )
      }
    }

    setFilteredEvents(filtered)
  }, [events, searchTerm, selectedEventType, selectedTimeRange])

  const getEventIcon = (eventType, severity) => {
    if (eventType === 'alert') {
      switch (severity) {
        case 'critical': return 'AlertCircle'
        case 'high': return 'AlertTriangle'
        case 'medium': return 'Info'
        case 'low': return 'Bell'
        default: return 'Bell'
      }
    }
    
    // Threat events
    return 'Shield'
  }

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'critical'
      case 'high': return 'high'
      case 'medium': return 'medium'
      case 'low': return 'low'
      default: return 'default'
    }
  }

  const formatEventTime = (timestamp) => {
    const date = new Date(timestamp)
    
    if (isToday(date)) {
      return `Today, ${format(date, 'HH:mm')}`
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, 'HH:mm')}`
    } else {
      return format(date, 'MMM dd, yyyy HH:mm')
    }
  }

  const groupEventsByDate = (events) => {
    const groups = {}
    
    events.forEach(event => {
      const date = new Date(event.eventTime)
      let dateKey
      
      if (isToday(date)) {
        dateKey = 'Today'
      } else if (isYesterday(date)) {
        dateKey = 'Yesterday'
      } else {
        dateKey = format(date, 'MMMM dd, yyyy')
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(event)
    })
    
    return groups
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedEventType('')
    setSelectedTimeRange('all')
  }

  const hasActiveFilters = searchTerm || selectedEventType || selectedTimeRange !== 'all'
  const eventGroups = groupEventsByDate(filteredEvents)

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-surface-600 rounded w-48 mb-4"></div>
          <div className="h-4 bg-surface-600 rounded w-96"></div>
        </div>
        <SkeletonLoader count={8} type="list" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to Load Timeline"
          message={error}
          onRetry={loadTimelineData}
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
        <h1 className="text-3xl font-bold text-white mb-2">Security Timeline</h1>
        <p className="text-gray-400">
          Chronological view of all security events, threats, and alerts
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface-800 border border-surface-600 rounded-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <SearchBar
              placeholder="Search timeline events..."
              onSearch={setSearchTerm}
              className="w-full"
            />
          </div>
          
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="px-3 py-2 bg-surface-700 border border-surface-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Event Types</option>
            <option value="threat">Threats</option>
            <option value="alert">Alerts</option>
          </select>
          
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 bg-surface-700 border border-surface-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>
        
        {hasActiveFilters && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-600">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Active filters:</span>
              {searchTerm && <Badge variant="primary" size="small">Search: {searchTerm}</Badge>}
              {selectedEventType && <Badge variant="warning" size="small">Type: {selectedEventType}</Badge>}
              {selectedTimeRange !== 'all' && <Badge variant="info" size="small">Time: {selectedTimeRange}</Badge>}
            </div>
            <Button
              variant="ghost"
              size="small"
              onClick={clearFilters}
            >
              Clear All
            </Button>
          </div>
        )}
      </motion.div>

      {/* Timeline */}
      <div className="space-y-8">
        {Object.keys(eventGroups).length === 0 ? (
          <EmptyState
            title={hasActiveFilters ? "No matching events" : "No events found"}
            description={
              hasActiveFilters 
                ? "Try adjusting your filters to see more results."
                : "No security events have been recorded yet. Events will appear here as they occur."
            }
            actionLabel={hasActiveFilters ? "Clear Filters" : "Refresh Timeline"}
            onAction={hasActiveFilters ? clearFilters : loadTimelineData}
            icon={hasActiveFilters ? "Filter" : "Clock"}
          />
        ) : (
          Object.entries(eventGroups).map(([dateKey, dayEvents]) => (
            <motion.div
              key={dateKey}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Date Header */}
              <div className="sticky top-0 z-10 bg-surface-900 py-2 mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center">
                  <ApperIcon name="Calendar" className="w-5 h-5 mr-2 text-primary" />
                  {dateKey}
                  <span className="ml-2 text-sm font-normal text-gray-400">
                    ({dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''})
                  </span>
                </h2>
              </div>

              {/* Timeline Events */}
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-surface-600"></div>

                <div className="space-y-4">
                  {dayEvents.map((event, index) => (
                    <motion.div
                      key={`${event.eventType}-${event.Id}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative flex items-start"
                    >
                      {/* Timeline Dot */}
                      <div className={`absolute left-4 w-4 h-4 rounded-full border-2 border-surface-900 z-10 ${
                        event.eventType === 'threat' ? 'bg-error' : 'bg-info'
                      }`}></div>

                      {/* Event Card */}
                      <div className="ml-12 flex-1">
                        <Card className={`${
                          event.eventType === 'alert' && !event.isRead 
                            ? 'border-l-4 border-l-primary' 
                            : ''
                        }`}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center justify-center w-8 h-8 bg-surface-700 rounded-lg">
                                <ApperIcon 
                                  name={getEventIcon(event.eventType, event.severity)} 
                                  className="w-4 h-4 text-gray-300" 
                                />
                              </div>
                              <div>
                                <h3 className="font-medium text-white capitalize">
                                  {event.title}
                                </h3>
                                <p className="text-xs text-gray-500">
                                  {formatEventTime(event.eventTime)}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Badge variant={getSeverityColor(event.severity)}>
                                {event.severity?.toUpperCase()}
                              </Badge>
                              <Badge variant={event.eventType === 'threat' ? 'error' : 'info'}>
                                {event.eventType.toUpperCase()}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-gray-300 text-sm mb-3 break-words">
                            {event.description}
                          </p>

                          {event.source && (
                            <div className="flex items-center text-xs text-gray-500">
                              <ApperIcon name="User" className="w-3 h-3 mr-1" />
                              <span>Source: {event.source}</span>
                            </div>
                          )}

                          {event.eventType === 'alert' && !event.isRead && (
                            <div className="mt-3 pt-3 border-t border-surface-600">
                              <Badge variant="primary" size="small">
                                Unread
                              </Badge>
                            </div>
                          )}
                        </Card>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Summary Footer */}
      {filteredEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-surface-800 border border-surface-600 rounded-lg p-4"
        >
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              Showing {filteredEvents.length} of {events.length} events
            </span>
            <div className="flex items-center space-x-4">
              <span>Threats: {filteredEvents.filter(e => e.eventType === 'threat').length}</span>
              <span>Alerts: {filteredEvents.filter(e => e.eventType === 'alert').length}</span>
              <span>Critical: {filteredEvents.filter(e => e.severity === 'critical').length}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Timeline