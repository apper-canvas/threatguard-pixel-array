import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'

const AlertItem = ({ alert, onClick, onMarkRead }) => {
  const getPriorityIcon = (priority) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'AlertCircle'
      case 'high': return 'AlertTriangle'
      case 'medium': return 'Info'
      case 'low': return 'Bell'
      default: return 'Bell'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'critical': return 'critical'
      case 'high': return 'high'
      case 'medium': return 'medium'
      case 'low': return 'low'
      default: return 'default'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
      className={`flex items-start p-3 rounded-lg cursor-pointer transition-all ${
        alert.isRead 
          ? 'bg-surface-800 hover:bg-surface-700' 
          : 'bg-surface-700 hover:bg-surface-600 border-l-4 border-l-primary'
      }`}
      onClick={() => onClick && onClick(alert)}
    >
      <div className="flex items-center justify-center w-8 h-8 bg-surface-600 rounded-lg mr-3 flex-shrink-0">
        <ApperIcon 
          name={getPriorityIcon(alert.priority)} 
          className="w-4 h-4 text-gray-300" 
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between mb-1">
          <p className={`text-sm break-words ${alert.isRead ? 'text-gray-400' : 'text-white font-medium'}`}>
            {alert.message}
          </p>
          <Badge 
            variant={getPriorityColor(alert.priority)} 
            size="small"
            className="ml-2 flex-shrink-0"
          >
            {alert.priority.toUpperCase()}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {format(new Date(alert.createdAt), 'MMM dd, HH:mm')}
          </span>
          
          {!alert.isRead && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMarkRead && onMarkRead(alert)
              }}
              className="text-xs text-primary hover:text-blue-400 transition-colors"
            >
              Mark as read
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default AlertItem