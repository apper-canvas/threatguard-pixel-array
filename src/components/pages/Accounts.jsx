import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import AccountCard from '@/components/molecules/AccountCard'
import SearchBar from '@/components/molecules/SearchBar'
import StatCard from '@/components/molecules/StatCard'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import SkeletonLoader from '@/components/organisms/SkeletonLoader'
import ErrorState from '@/components/organisms/ErrorState'
import EmptyState from '@/components/organisms/EmptyState'
import { suspiciousAccountService } from '@/services'

const Accounts = () => {
  const [accounts, setAccounts] = useState([])
  const [filteredAccounts, setFilteredAccounts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedThreatLevel, setSelectedThreatLevel] = useState('')
  const [selectedFlag, setSelectedFlag] = useState('')
  const [sortBy, setSortBy] = useState('threatScore')

  const loadAccounts = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await suspiciousAccountService.getAll()
      setAccounts(result)
      setFilteredAccounts(result)
    } catch (err) {
      setError(err.message || 'Failed to load accounts')
      toast.error('Failed to load accounts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAccounts()
  }, [])

  useEffect(() => {
    let filtered = accounts

    // Filter by search term
if (searchTerm) {
      filtered = filtered.filter(account =>
        account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.flags?.some(flag => flag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by threat level
    if (selectedThreatLevel) {
filtered = filtered.filter(account => {
        const score = account.threatScore
        switch (selectedThreatLevel) {
          case 'critical': return score >= 90
          case 'high': return score >= 70 && score < 90
          case 'medium': return score >= 50 && score < 70
          case 'low': return score < 50
          default: return true
        }
      })
    }

    // Filter by flag
    if (selectedFlag) {
      filtered = filtered.filter(account =>
        account.flags?.includes(selectedFlag)
      )
    }

    // Sort accounts
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'threatScore':
          return b.threatScore - a.threatScore
return b.interactions - a.interactions
        case 'firstSeen':
          return new Date(b.firstSeen) - new Date(a.firstSeen)
        case 'username':
          return a.username.localeCompare(b.username)
          return a.username.localeCompare(b.username)
        default:
          return 0
      }
    })

    setFilteredAccounts(filtered)
  }, [accounts, searchTerm, selectedThreatLevel, selectedFlag, sortBy])

  const handleAccountAction = async (action, account) => {
    try {
      switch (action) {
        case 'view':
          toast.info(`Viewing profile for ${account.username}`)
          break
        case 'investigate':
          toast.info(`Starting investigation for ${account.username}`)
          setTimeout(() => toast.success('Investigation completed'), 2000)
          break
        case 'block':
          await suspiciousAccountService.delete(account.Id)
          setAccounts(prev => prev.filter(a => a.Id !== account.Id))
          toast.success(`${account.username} has been blocked`)
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
    setSelectedThreatLevel('')
    setSelectedFlag('')
    setSortBy('threatScore')
  }

  const hasActiveFilters = searchTerm || selectedThreatLevel || selectedFlag || sortBy !== 'threatScore'

  // Get unique flags for filter dropdown
  const allFlags = accounts.flatMap(account => account.flags || [])
  const uniqueFlags = [...new Set(allFlags)]

  // Calculate statistics
  const criticalAccounts = accounts.filter(a => a.threatScore >= 90).length
  const highRiskAccounts = accounts.filter(a => a.threatScore >= 70).length
  const averageThreatScore = accounts.length > 0 
    ? Math.round(accounts.reduce((sum, a) => sum + a.threatScore, 0) / accounts.length)
    : 0
  const totalInteractions = accounts.reduce((sum, a) => sum + a.interactions, 0)

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-surface-600 rounded w-48 mb-4"></div>
          <div className="h-4 bg-surface-600 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <SkeletonLoader count={4} type="stat" />
        </div>
        <SkeletonLoader count={5} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to Load Accounts"
          message={error}
          onRetry={loadAccounts}
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
        <h1 className="text-3xl font-bold text-white mb-2">Suspicious Accounts</h1>
        <p className="text-gray-400">
          Analyze and manage potentially harmful accounts that have interacted with your content
        </p>
      </motion.div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Critical Risk"
          value={criticalAccounts}
          change={`${Math.round((criticalAccounts / Math.max(accounts.length, 1)) * 100)}% of total`}
          changeType="negative"
          icon="UserX"
          color="error"
        />
        <StatCard
          title="High Risk"
          value={highRiskAccounts}
          change={`${Math.round((highRiskAccounts / Math.max(accounts.length, 1)) * 100)}% of total`}
          changeType="warning"
          icon="AlertTriangle"
          color="warning"
        />
        <StatCard
          title="Avg Threat Score"
          value={averageThreatScore}
          change="Out of 100"
          changeType={averageThreatScore > 70 ? 'negative' : averageThreatScore > 50 ? 'warning' : 'positive'}
          icon="BarChart3"
          color="info"
        />
        <StatCard
          title="Total Interactions"
          value={totalInteractions}
          change="All accounts"
          changeType="neutral"
          icon="MessageCircle"
          color="secondary"
        />
      </div>

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
              placeholder="Search accounts..."
              onSearch={setSearchTerm}
              className="w-full"
            />
          </div>
          
          <select
            value={selectedThreatLevel}
            onChange={(e) => setSelectedThreatLevel(e.target.value)}
            className="px-3 py-2 bg-surface-700 border border-surface-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Threat Levels</option>
            <option value="critical">Critical (90+)</option>
            <option value="high">High (70-89)</option>
            <option value="medium">Medium (50-69)</option>
            <option value="low">Low (&lt;50)</option>
          </select>
          
          <select
            value={selectedFlag}
            onChange={(e) => setSelectedFlag(e.target.value)}
            className="px-3 py-2 bg-surface-700 border border-surface-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Flags</option>
            {uniqueFlags.map(flag => (
              <option key={flag} value={flag}>
                {flag.replace('_', ' ')}
              </option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-surface-700 border border-surface-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="threatScore">Sort by Threat Score</option>
            <option value="interactions">Sort by Interactions</option>
            <option value="firstSeen">Sort by First Seen</option>
            <option value="username">Sort by Username</option>
          </select>
        </div>
        
        {hasActiveFilters && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-600">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-400">Active filters:</span>
              {searchTerm && <Badge variant="primary" size="small">Search: {searchTerm}</Badge>}
              {selectedThreatLevel && <Badge variant="warning" size="small">Level: {selectedThreatLevel}</Badge>}
              {selectedFlag && <Badge variant="info" size="small">Flag: {selectedFlag.replace('_', ' ')}</Badge>}
              {sortBy !== 'threatScore' && <Badge variant="secondary" size="small">Sort: {sortBy.replace(/([A-Z])/g, ' $1')}</Badge>}
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

      {/* Accounts List */}
      <div className="space-y-4">
        {filteredAccounts.length === 0 ? (
          <EmptyState
            title={hasActiveFilters ? "No matching accounts" : "No suspicious accounts"}
            description={
              hasActiveFilters 
                ? "Try adjusting your filters to see more results."
                : "Great news! No suspicious accounts have been detected. Your followers appear to be genuine."
            }
            actionLabel={hasActiveFilters ? "Clear Filters" : "Scan Followers"}
            onAction={hasActiveFilters ? clearFilters : () => toast.info("Starting follower scan...")}
            icon={hasActiveFilters ? "Filter" : "Users"}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAccounts.map((account, index) => (
              <motion.div
                key={account.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AccountCard
                  account={account}
                  onView={(a) => handleAccountAction('view', a)}
                  onInvestigate={(a) => handleAccountAction('investigate', a)}
                  onBlock={(a) => handleAccountAction('block', a)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {filteredAccounts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-surface-800 border border-surface-600 rounded-lg p-4"
        >
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              Showing {filteredAccounts.length} of {accounts.length} accounts
            </span>
            <div className="flex items-center space-x-4">
              <span>Critical: {filteredAccounts.filter(a => a.threatScore >= 90).length}</span>
              <span>High Risk: {filteredAccounts.filter(a => a.threatScore >= 70).length}</span>
              <span>Medium Risk: {filteredAccounts.filter(a => a.threatScore >= 50 && a.threatScore < 70).length}</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Accounts