import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'

const AccountCard = ({ account, onView, onBlock, onInvestigate }) => {
  const getThreatLevel = (score) => {
    if (score >= 90) return { level: 'Critical', color: 'critical' }
    if (score >= 70) return { level: 'High', color: 'high' }
    if (score >= 50) return { level: 'Medium', color: 'medium' }
    return { level: 'Low', color: 'low' }
  }

  const threatLevel = getThreatLevel(account.threatScore)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card hover className="border-l-4 border-l-warning">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-surface-700 rounded-full">
              <ApperIcon name="User" className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <h3 className="font-medium text-white">
                {account.username}
              </h3>
              <p className="text-sm text-gray-400">
                {account.interactions} interactions
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-2xl font-bold text-white">
                {account.threatScore}
              </span>
              <Badge variant={threatLevel.color}>
                {threatLevel.level}
              </Badge>
            </div>
            <p className="text-xs text-gray-500">Threat Score</p>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Detected Flags:</h4>
          <div className="flex flex-wrap gap-2">
            {account.flags?.map((flag, index) => (
              <Badge key={index} variant="warning" size="small">
                {flag.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            First seen: {format(new Date(account.firstSeen), 'MMM dd, yyyy')}
          </span>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="small"
              icon="Eye"
              onClick={() => onView && onView(account)}
            >
              View
            </Button>
            <Button
              variant="outline"
              size="small"
              icon="Search"
              onClick={() => onInvestigate && onInvestigate(account)}
            >
              Investigate
            </Button>
            <Button
              variant="danger"
              size="small"
              icon="Ban"
              onClick={() => onBlock && onBlock(account)}
            >
              Block
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default AccountCard