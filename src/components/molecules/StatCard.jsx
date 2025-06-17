import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon, 
  color = 'primary',
  loading = false,
  className = '' 
}) => {
  const getChangeColor = (type) => {
    switch (type) {
      case 'positive': return 'text-success'
      case 'negative': return 'text-error'
      case 'warning': return 'text-warning'
      default: return 'text-gray-400'
    }
  }

  const getChangeIcon = (type) => {
    switch (type) {
      case 'positive': return 'TrendingUp'
      case 'negative': return 'TrendingDown'
      case 'warning': return 'AlertTriangle'
      default: return 'Minus'
    }
  }

  const getIconColor = (color) => {
    switch (color) {
      case 'primary': return 'text-primary'
      case 'secondary': return 'text-secondary'
      case 'success': return 'text-success'
      case 'warning': return 'text-warning'
      case 'error': return 'text-error'
      default: return 'text-gray-400'
    }
  }

  if (loading) {
    return (
      <Card className={className}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-surface-600 rounded w-1/2"></div>
            <div className="w-8 h-8 bg-surface-600 rounded-lg"></div>
          </div>
          <div className="h-8 bg-surface-600 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-surface-600 rounded w-1/3"></div>
        </div>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover className={className}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          {icon && (
            <div className={`flex items-center justify-center w-8 h-8 bg-surface-700 rounded-lg`}>
              <ApperIcon name={icon} className={`w-4 h-4 ${getIconColor(color)}`} />
            </div>
          )}
        </div>
        
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-2xl font-bold text-white mb-1"
        >
          {value}
        </motion.div>
        
        {change !== undefined && (
          <div className={`flex items-center text-sm ${getChangeColor(changeType)}`}>
            <ApperIcon name={getChangeIcon(changeType)} className="w-3 h-3 mr-1" />
            <span>{change}</span>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

export default StatCard