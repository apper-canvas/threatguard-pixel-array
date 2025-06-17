import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'

const QuickActions = ({ onAction }) => {
  const actions = [
    {
      id: 'scan_comments',
      label: 'Scan Comments',
      description: 'Analyze recent comments for threats',
      icon: 'MessageSquare',
      color: 'primary'
    },
    {
      id: 'check_followers',
      label: 'Check Followers',
      description: 'Identify suspicious followers',
      icon: 'Users',
      color: 'secondary'
    },
    {
      id: 'add_keyword',
      label: 'Add Keyword',
      description: 'Configure new monitoring term',
      icon: 'Plus',
      color: 'success'
    },
    {
      id: 'generate_report',
      label: 'Generate Report',
      description: 'Create security summary',
      icon: 'FileText',
      color: 'warning'
    }
  ]

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary': return 'bg-primary hover:bg-blue-700 text-white'
      case 'secondary': return 'bg-secondary hover:bg-blue-600 text-white'
      case 'success': return 'bg-success hover:bg-green-600 text-white'
      case 'warning': return 'bg-warning hover:bg-yellow-600 text-surface-900'
      default: return 'bg-surface-600 hover:bg-surface-500 text-white'
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAction && onAction(action.id)}
              className={`w-full p-4 rounded-lg transition-all text-left ${getColorClasses(action.color)}`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg">
                  <ApperIcon name={action.icon} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">{action.label}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </div>
            </motion.button>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-surface-600">
        <Button
          variant="outline"
          icon="Settings"
          className="w-full"
          onClick={() => onAction && onAction('settings')}
        >
          Advanced Settings
        </Button>
      </div>
    </Card>
  )
}

export default QuickActions