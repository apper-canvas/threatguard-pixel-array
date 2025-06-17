import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const KeywordItem = ({ keyword, onToggle, onEdit, onDelete }) => {
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'critical'
      case 'high': return 'high'
      case 'medium': return 'medium'
      case 'low': return 'low'
      default: return 'default'
    }
  }

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'harassment': return 'UserX'
      case 'spam': return 'Mail'
      case 'phishing': return 'Link'
      case 'cyberbullying': return 'MessageCircle'
      case 'impersonation': return 'Copy'
      default: return 'Search'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center justify-between p-4 bg-surface-800 border border-surface-600 rounded-lg ${
        keyword.isActive ? '' : 'opacity-60'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-10 h-10 bg-surface-700 rounded-lg">
          <ApperIcon 
            name={getCategoryIcon(keyword.category)} 
            className="w-5 h-5 text-gray-400" 
          />
        </div>
        
        <div>
          <h3 className="font-medium text-white">
            "{keyword.term}"
          </h3>
          <p className="text-sm text-gray-400 capitalize">
            {keyword.category.replace('_', ' ')}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Badge variant={getSeverityColor(keyword.severity)}>
          {keyword.severity.toUpperCase()}
        </Badge>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="small"
            icon={keyword.isActive ? "Toggle" : "ToggleLeft"}
            onClick={() => onToggle && onToggle(keyword)}
            className={keyword.isActive ? 'text-success' : 'text-gray-500'}
          >
            {keyword.isActive ? 'Active' : 'Inactive'}
          </Button>
          
          <Button
            variant="ghost"
            size="small"
            icon="Edit"
            onClick={() => onEdit && onEdit(keyword)}
          >
            Edit
          </Button>
          
          <Button
            variant="ghost"
            size="small"
            icon="Trash2"
            onClick={() => onDelete && onDelete(keyword)}
            className="text-error hover:text-red-400"
          >
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default KeywordItem