import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  variant = 'default',
  padding = 'medium',
  hover = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = 'bg-surface-800 border border-surface-600 rounded-lg shadow-sm'
  
  const variants = {
    default: '',
    elevated: 'shadow-lg',
    outlined: 'border-2',
    ghost: 'bg-transparent border-0 shadow-none'
  }
  
  const paddings = {
    none: '',
    small: 'p-3',
    medium: 'p-4',
    large: 'p-6'
  }
  
  const classes = `${baseClasses} ${variants[variant]} ${paddings[padding]} ${className} ${
    onClick ? 'cursor-pointer' : ''
  }`

  const cardContent = (
    <div className={classes} onClick={onClick} {...props}>
      {children}
    </div>
  )

  if (hover || onClick) {
    return (
      <motion.div
        whileHover={{ 
          scale: 1.02,
          boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)"
        }}
        whileTap={onClick ? { scale: 0.98 } : {}}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {cardContent}
      </motion.div>
    )
  }

  return cardContent
}

export default Card