import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import KeywordItem from '@/components/molecules/KeywordItem'
import SearchBar from '@/components/molecules/SearchBar'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Card from '@/components/atoms/Card'
import ApperIcon from '@/components/ApperIcon'
import SkeletonLoader from '@/components/organisms/SkeletonLoader'
import ErrorState from '@/components/organisms/ErrorState'
import EmptyState from '@/components/organisms/EmptyState'
import { keywordService } from '@/services'

const Keywords = () => {
  const [keywords, setKeywords] = useState([])
  const [filteredKeywords, setFilteredKeywords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSeverity, setSelectedSeverity] = useState('')
  const [showActiveOnly, setShowActiveOnly] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingKeyword, setEditingKeyword] = useState(null)

  const [formData, setFormData] = useState({
    term: '',
    category: 'harassment',
    severity: 'medium'
  })

  const loadKeywords = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await keywordService.getAll()
      setKeywords(result)
      setFilteredKeywords(result)
    } catch (err) {
      setError(err.message || 'Failed to load keywords')
      toast.error('Failed to load keywords')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadKeywords()
  }, [])

  useEffect(() => {
    let filtered = keywords

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(keyword =>
        keyword.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        keyword.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(keyword => keyword.category === selectedCategory)
    }

    // Filter by severity
    if (selectedSeverity) {
      filtered = filtered.filter(keyword => keyword.severity === selectedSeverity)
    }

    // Filter by active status
if (showActiveOnly) {
      filtered = filtered.filter(keyword => keyword.isActive)
    }

    setFilteredKeywords(filtered)
  }, [keywords, searchTerm, selectedCategory, selectedSeverity, showActiveOnly])

  const handleToggleKeyword = async (keyword) => {
    try {
      const updated = await keywordService.toggleActive(keyword.Id)
      setKeywords(prev => prev.map(k => 
        k.Id === keyword.Id ? updated : k
      ))
      toast.success(`Keyword ${updated.isActive ? 'activated' : 'deactivated'}`)
    } catch (err) {
      toast.error('Failed to toggle keyword')
    }
  }

  const handleEditKeyword = (keyword) => {
    setEditingKeyword(keyword)
    setFormData({
      term: keyword.term,
category: keyword.category,
      severity: keyword.severity
    })
    setShowAddModal(true)
  }

  const handleDeleteKeyword = async (keyword) => {
    if (window.confirm(`Are you sure you want to delete "${keyword.term}"?`)) {
      try {
        await keywordService.delete(keyword.Id)
        setKeywords(prev => prev.filter(k => k.Id !== keyword.Id))
        toast.success('Keyword deleted successfully')
      } catch (err) {
        toast.error('Failed to delete keyword')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.term.trim()) {
      toast.error('Please enter a keyword term')
      return
    }

    try {
      if (editingKeyword) {
        const updated = await keywordService.update(editingKeyword.Id, formData)
        setKeywords(prev => prev.map(k => 
          k.Id === editingKeyword.Id ? updated : k
        ))
        toast.success('Keyword updated successfully')
      } else {
        const newKeyword = await keywordService.create(formData)
        setKeywords(prev => [newKeyword, ...prev])
        toast.success('Keyword added successfully')
      }
      
      setShowAddModal(false)
      setEditingKeyword(null)
      setFormData({ term: '', category: 'harassment', severity: 'medium' })
    } catch (err) {
      toast.error(editingKeyword ? 'Failed to update keyword' : 'Failed to add keyword')
    }
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setEditingKeyword(null)
    setFormData({ term: '', category: 'harassment', severity: 'medium' })
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedSeverity('')
    setShowActiveOnly(false)
  }

  const hasActiveFilters = searchTerm || selectedCategory || selectedSeverity || showActiveOnly

  // Get unique values for filters
  const categories = [...new Set(keywords.map(k => k.category))]
  const severities = [...new Set(keywords.map(k => k.severity))]

  // Calculate statistics
  const activeKeywords = keywords.filter(k => k.isActive).length
  const criticalKeywords = keywords.filter(k => k.severity === 'critical').length
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = keywords.filter(k => k.category === cat).length
    return acc
  }, {})

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-surface-600 rounded w-48 mb-4"></div>
          <div className="h-4 bg-surface-600 rounded w-96"></div>
        </div>
        <SkeletonLoader count={5} type="list" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to Load Keywords"
          message={error}
          onRetry={loadKeywords}
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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Keyword Monitoring</h1>
          <p className="text-gray-400">
            Configure and manage terms to monitor for potential security threats
          </p>
        </div>
        
        <Button
          onClick={() => setShowAddModal(true)}
          icon="Plus"
          variant="primary"
        >
          Add Keyword
        </Button>
      </motion.div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Keywords</p>
              <p className="text-2xl font-bold text-white">{keywords.length}</p>
            </div>
            <ApperIcon name="Search" className="w-8 h-8 text-primary" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Active</p>
              <p className="text-2xl font-bold text-success">{activeKeywords}</p>
            </div>
            <ApperIcon name="ToggleRight" className="w-8 h-8 text-success" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Critical</p>
              <p className="text-2xl font-bold text-error">{criticalKeywords}</p>
            </div>
            <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error" />
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Categories</p>
              <p className="text-2xl font-bold text-white">{categories.length}</p>
            </div>
            <ApperIcon name="Tag" className="w-8 h-8 text-secondary" />
          </div>
        </Card>
      </div>

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
              placeholder="Search keywords..."
              onSearch={setSearchTerm}
              className="w-full"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-surface-700 border border-surface-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category} className="capitalize">
                {category.replace('_', ' ')}
              </option>
            ))}
          </select>
          
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-2 bg-surface-700 border border-surface-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Severities</option>
            {severities.map(severity => (
              <option key={severity} value={severity} className="capitalize">
                {severity}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-600">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
                className="w-4 h-4 text-primary bg-surface-700 border-surface-600 rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-400">Show active only</span>
            </label>
            
            {hasActiveFilters && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Filters:</span>
                {searchTerm && <Badge variant="primary" size="small">Search: {searchTerm}</Badge>}
                {selectedCategory && <Badge variant="warning" size="small">Category: {selectedCategory}</Badge>}
                {selectedSeverity && <Badge variant="info" size="small">Severity: {selectedSeverity}</Badge>}
                {showActiveOnly && <Badge variant="success" size="small">Active only</Badge>}
              </div>
            )}
          </div>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="small"
              onClick={clearFilters}
            >
              Clear All
            </Button>
          )}
        </div>
      </motion.div>

      {/* Keywords List */}
      <div className="space-y-4">
        {filteredKeywords.length === 0 ? (
          <EmptyState
            title={hasActiveFilters ? "No matching keywords" : "No keywords configured"}
            description={
              hasActiveFilters 
                ? "Try adjusting your filters to see more results."
                : "Start by adding keywords and phrases you want to monitor for potential security threats."
            }
            actionLabel={hasActiveFilters ? "Clear Filters" : "Add First Keyword"}
            onAction={hasActiveFilters ? clearFilters : () => setShowAddModal(true)}
            icon={hasActiveFilters ? "Filter" : "Search"}
          />
        ) : (
          filteredKeywords.map((keyword, index) => (
            <motion.div
              key={keyword.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <KeywordItem
                keyword={keyword}
                onToggle={handleToggleKeyword}
                onEdit={handleEditKeyword}
                onDelete={handleDeleteKeyword}
              />
            </motion.div>
          ))
        )}
      </div>

      {/* Summary Footer */}
      {filteredKeywords.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-surface-800 border border-surface-600 rounded-lg p-4"
        >
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>
              Showing {filteredKeywords.length} of {keywords.length} keywords
            </span>
            <div className="flex items-center space-x-4">
              <span>Active: {filteredKeywords.filter(k => k.isActive).length}</span>
              <span>Critical: {filteredKeywords.filter(k => k.severity === 'critical').length}</span>
              <span>High: {filteredKeywords.filter(k => k.severity === 'high').length}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add/Edit Keyword Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={handleCloseModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <Card className="w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white">
                    {editingKeyword ? 'Edit Keyword' : 'Add New Keyword'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Keyword Term"
                    value={formData.term}
                    onChange={(e) => setFormData(prev => ({ ...prev, term: e.target.value }))}
                    placeholder="Enter keyword or phrase..."
                    required
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 bg-surface-700 border border-surface-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="harassment">Harassment</option>
                      <option value="spam">Spam</option>
                      <option value="phishing">Phishing</option>
                      <option value="cyberbullying">Cyberbullying</option>
                      <option value="impersonation">Impersonation</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Severity Level
                    </label>
                    <select
                      value={formData.severity}
                      onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value }))}
                      className="w-full px-3 py-2 bg-surface-700 border border-surface-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                    >
                      {editingKeyword ? 'Update' : 'Add'} Keyword
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Keywords