import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-900'
  
  const variants = {
    primary: 'bg-primary hover:bg-blue-800 text-white focus:ring-primary',
    secondary: 'bg-surface-600 hover:bg-surface-500 text-white focus:ring-surface-500',
    outline: 'border border-surface-400 hover:border-surface-300 text-gray-300 hover:text-white hover:bg-surface-700 focus:ring-surface-500',
    danger: 'bg-error hover:bg-red-600 text-white focus:ring-error',
    success: 'bg-success hover:bg-green-600 text-white focus:ring-success',
    ghost: 'text-gray-300 hover:text-white hover:bg-surface-700 focus:ring-surface-500'
  }
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
    disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  }`

  const handleClick = (e) => {
    if (disabled || loading || !onClick) return
    onClick(e)
  }

  return (
    <motion.button
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={classes}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
      )}
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 mr-2" />
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon name={icon} className="w-4 h-4 ml-2" />
      )}
    </motion.button>
  )
}

export default Button