import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ThreatCard from '@/components/molecules/ThreatCard'
import SearchBar from '@/components/molecules/SearchBar'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import SkeletonLoader from '@/components/organisms/SkeletonLoader'
import ErrorState from '@/components/organisms/ErrorState'
import EmptyState from '@/components/organisms/EmptyState'
import { threatService } from '@/services'

const Threats = () => {
  const [threats, setThreats] = useState([])
  const [filteredThreats, setFilteredThreats] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSeverity, setSelectedSeverity] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedType, setSelectedType] = useState('')

  const loadThreats = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await threatService.getAll()
      const sortedThreats = result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      setThreats(sortedThreats)
      setFilteredThreats(sortedThreats)
    } catch (err) {
      setError(err.message || 'Failed to load threats')
      toast.error('Failed to load threats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadThreats()
  }, [])

  useEffect(() => {
    let filtered = threats

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(threat =>
        threat.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        threat.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        threat.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by severity
    if (selectedSeverity) {
      filtered = filtered.filter(threat => threat.severity === selectedSeverity)
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(threat => threat.status === selectedStatus)
    }

    // Filter by type
    if (selectedType) {
      filtered = filtered.filter(threat => threat.type === selectedType)
    }

    setFilteredThreats(filtered)
  }, [threats, searchTerm, selectedSeverity, selectedStatus, selectedType])

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

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedSeverity('')
    setSelectedStatus('')
    setSelectedType('')
  }

  const hasActiveFilters = searchTerm || selectedSeverity || selectedStatus || selectedType

  // Get unique values for filters
  const severityOptions = [...new Set(threats.map(t => t.severity))]
  const statusOptions = [...new Set(threats.map(t => t.status))]
  const typeOptions = [...new Set(threats.map(t => t.type))]

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-surface-600 rounded w-48 mb-4"></div>
          <div className="h-4 bg-surface-600 rounded w-96"></div>
        </div>
        <SkeletonLoader count={5} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to Load Threats"
          message={error}
          onRetry={loadThreats}
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
        <h1 className="text-3xl font-bold text-white mb-2">Threat Management</h1>
        <p className="text-gray-400">
          Monitor, analyze, and respond to security threats across your Instagram activity
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface-800 border border-surface-600 rounded-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <SearchBar
              placeholder="Search threats..."
              onSearch={setSearchTerm}
              className="w-full"
            />
          </div>
          
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-2 bg-surface-700 border border-surface-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Severities</option>
            {severityOptions.map(severity => (
              <option key={severity} value={severity} className="capitalize">
                {severity}
              </option>
            ))}
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-surface-700 border border-surface-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Statuses</option>
            {statusOptions.map(status => (
              <option key={status} value={status} className="capitalize">
                {status}
              </option>
            ))}
          </select>
          
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-surface-700 border border-surface-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Types</option>
            {typeOptions.map(type => (
              <option key={type} value={type} className="capitalize">
                {type.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        
        {hasActiveFilters && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-600">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Active filters:</span>
              {searchTerm && <Badge variant="primary" size="small">Search: {searchTerm}</Badge>}
              {selectedSeverity && <Badge variant="warning" size="small">Severity: {selectedSeverity}</Badge>}
              {selectedStatus && <Badge variant="info" size="small">Status: {selectedStatus}</Badge>}
              {selectedType && <Badge variant="secondary" size="small">Type: {selectedType.replace('_', ' ')}</Badge>}
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

      {/* Threats List */}
      <div className="space-y-4">
        {filteredThreats.length === 0 ? (
          <EmptyState
            title={hasActiveFilters ? "No matching threats" : "No threats detected"}
            description={
              hasActiveFilters 
                ? "Try adjusting your filters to see more results."
                : "Great news! No security threats have been detected. Your account appears to be secure."
            }
            actionLabel={hasActiveFilters ? "Clear Filters" : "Run Security Scan"}
            onAction={hasActiveFilters ? clearFilters : () => toast.info("Starting security scan...")}
            icon={hasActiveFilters ? "Filter" : "Shield"}
          />
        ) : (
          filteredThreats.map((threat, index) => (
            <motion.div
              key={threat.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ThreatCard
                threat={threat}
                onView={(t) => handleThreatAction('view', t)}
                onResolve={(t) => handleThreatAction('resolve', t)}
                onBlock={(t) => handleThreatAction('block', t)}
              />
            </motion.div>
          ))
        )}
      </div>

      {/* Summary Footer */}
      {filteredThreats.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-surface-800 border border-surface-600 rounded-lg p-4"
        >
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              Showing {filteredThreats.length} of {threats.length} threats
            </span>
            <div className="flex items-center space-x-4">
              <span>Active: {filteredThreats.filter(t => t.status === 'active').length}</span>
              <span>Critical: {filteredThreats.filter(t => t.severity === 'critical').length}</span>
              <span>Resolved: {filteredThreats.filter(t => t.status === 'resolved').length}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Threats