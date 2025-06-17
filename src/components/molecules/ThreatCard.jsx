import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'

const ThreatCard = ({ threat, onView, onResolve, onBlock }) => {
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'critical'
      case 'high': return 'high'
      case 'medium': return 'medium'
      case 'low': return 'low'
      default: return 'default'
    }
  }

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'harassment': return 'UserX'
      case 'spam': return 'Mail'
      case 'impersonation': return 'Copy'
      case 'cyberbullying': return 'MessageCircle'
      case 'phishing': return 'Link'
      default: return 'AlertTriangle'
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'error'
      case 'resolved': return 'success'
      case 'monitoring': return 'warning'
      case 'blocked': return 'default'
      default: return 'default'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover className="border-l-4 border-l-error">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-surface-700 rounded-lg">
              <ApperIcon 
                name={getTypeIcon(threat.type)} 
                className="w-5 h-5 text-error" 
              />
            </div>
            <div>
              <h3 className="font-medium text-white capitalize">
                {threat.type.replace('_', ' ')}
              </h3>
              <p className="text-sm text-gray-400">
                from {threat.source}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getSeverityColor(threat.severity)} pulse={threat.severity === 'critical'}>
              {threat.severity.toUpperCase()}
            </Badge>
            <Badge variant={getStatusColor(threat.status)}>
              {threat.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        <p className="text-gray-300 text-sm mb-4 break-words">
          {threat.content}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {format(new Date(threat.timestamp), 'MMM dd, yyyy HH:mm')}
          </span>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="small"
              icon="Eye"
              onClick={() => onView && onView(threat)}
            >
              View
            </Button>
            
            {threat.status === 'active' && (
              <>
                <Button
                  variant="outline"
                  size="small"
                  icon="Shield"
                  onClick={() => onResolve && onResolve(threat)}
                >
                  Resolve
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  icon="Ban"
                  onClick={() => onBlock && onBlock(threat)}
                >
                  Block
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default ThreatCard