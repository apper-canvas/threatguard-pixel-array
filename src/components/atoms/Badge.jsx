import { motion } from 'framer-motion'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'medium',
  pulse = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const variants = {
    default: 'bg-surface-600 text-gray-300',
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-surface-900',
    error: 'bg-error text-white',
    critical: 'bg-red-600 text-white',
    high: 'bg-error text-white',
    medium: 'bg-warning text-surface-900',
    low: 'bg-success text-white'
  }
  
  const sizes = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-1 text-sm',
    large: 'px-3 py-1.5 text-base'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`

  const badgeContent = (
    <span className={classes} {...props}>
      {children}
    </span>
  )

  if (pulse) {
    return (
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          opacity: [1, 0.8, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {badgeContent}
      </motion.div>
    )
  }

  return badgeContent
}

export default Badge