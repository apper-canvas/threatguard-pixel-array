import { motion } from 'framer-motion'

const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  const getSkeletonContent = (type) => {
    switch (type) {
      case 'list':
        return (
          <div className="flex items-center p-4 bg-surface-800 border border-surface-600 rounded-lg">
            <div className="w-10 h-10 bg-surface-600 rounded-lg mr-4"></div>
            <div className="flex-1">
              <div className="h-4 bg-surface-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-surface-600 rounded w-1/2"></div>
            </div>
          </div>
        )
      
      case 'stat':
        return (
          <div className="p-4 bg-surface-800 border border-surface-600 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="h-4 bg-surface-600 rounded w-1/2"></div>
              <div className="w-8 h-8 bg-surface-600 rounded-lg"></div>
            </div>
            <div className="h-8 bg-surface-600 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-surface-600 rounded w-1/3"></div>
          </div>
        )
      
      case 'card':
      default:
        return (
          <div className="p-6 bg-surface-800 border border-surface-600 rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-surface-600 rounded-lg"></div>
                <div>
                  <div className="h-4 bg-surface-600 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-surface-600 rounded w-16"></div>
                </div>
              </div>
              <div className="h-6 bg-surface-600 rounded w-16"></div>
            </div>
            <div className="h-4 bg-surface-600 rounded w-full mb-2"></div>
            <div className="h-4 bg-surface-600 rounded w-2/3 mb-4"></div>
            <div className="flex items-center justify-between">
              <div className="h-3 bg-surface-600 rounded w-20"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-surface-600 rounded w-16"></div>
                <div className="h-8 bg-surface-600 rounded w-16"></div>
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="animate-pulse"
        >
          {getSkeletonContent(type)}
        </motion.div>
      ))}
    </div>
  )
}

export default SkeletonLoader