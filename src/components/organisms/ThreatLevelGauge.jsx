import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const ThreatLevelGauge = ({ level = 0, maxLevel = 100, threats = [] }) => {
  const [animatedLevel, setAnimatedLevel] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedLevel(level)
    }, 500)
    return () => clearTimeout(timer)
  }, [level])

  const getThreatLevel = (score) => {
    if (score >= 80) return { 
      level: 'Critical', 
      color: 'text-red-500',
      bgColor: 'bg-red-500',
      description: 'Immediate attention required'
    }
    if (score >= 60) return { 
      level: 'High', 
      color: 'text-orange-500',
      bgColor: 'bg-orange-500',
      description: 'Multiple active threats detected'
    }
    if (score >= 40) return { 
      level: 'Medium', 
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500',
      description: 'Some threats require monitoring'
    }
    if (score >= 20) return { 
      level: 'Low', 
      color: 'text-green-500',
      bgColor: 'bg-green-500',
      description: 'Minor issues detected'
    }
    return { 
      level: 'Secure', 
      color: 'text-green-400',
      bgColor: 'bg-green-400',
      description: 'All systems secure'
    }
  }

  const threatInfo = getThreatLevel(level)
  const percentage = (level / maxLevel) * 100
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const getRecentThreats = () => {
    return threats
      .filter(threat => threat.status === 'active')
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 3)
  }

  return (
    <Card className="text-center">
      <h2 className="text-lg font-semibold text-white mb-6">Threat Level</h2>
      
      <div className="relative inline-flex items-center justify-center mb-6">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-surface-600"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={threatInfo.color}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-2xl font-bold text-white"
          >
            {Math.round(animatedLevel)}
          </motion.span>
          <span className="text-xs text-gray-400">/ {maxLevel}</span>
        </div>
      </div>

      <div className="mb-4">
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className={`text-xl font-bold ${threatInfo.color} mb-1`}
        >
          {threatInfo.level}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-sm text-gray-400"
        >
          {threatInfo.description}
        </motion.p>
      </div>

      {getRecentThreats().length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="border-t border-surface-600 pt-4"
        >
          <h4 className="text-sm font-medium text-gray-300 mb-3">Recent Active Threats</h4>
          <div className="space-y-2">
            {getRecentThreats().map((threat) => (
              <div
                key={threat.Id}
                className="flex items-center justify-between p-2 bg-surface-700 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <ApperIcon name="AlertTriangle" className="w-4 h-4 text-error" />
                  <span className="text-sm text-white capitalize">
                    {threat.type.replace('_', ' ')}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  threat.severity === 'critical' ? 'bg-red-600 text-white' :
                  threat.severity === 'high' ? 'bg-orange-600 text-white' :
                  threat.severity === 'medium' ? 'bg-yellow-600 text-surface-900' :
                  'bg-green-600 text-white'
                }`}>
                  {threat.severity.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </Card>
  )
}

export default ThreatLevelGauge