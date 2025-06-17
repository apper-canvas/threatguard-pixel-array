import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  
  const baseClasses = 'w-full px-3 py-2 bg-surface-700 border border-surface-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all'
  const errorClasses = error ? 'border-error focus:ring-error' : ''
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  const inputClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${icon ? 'pl-10' : ''} ${className}`

  return (
    <div className="w-full">
      {label && (
        <motion.label
          initial={{ opacity: 0.7 }}
          animate={{ 
            opacity: isFocused || value ? 1 : 0.7,
            scale: isFocused || value ? 0.9 : 1,
            y: isFocused || value ? -8 : 0
          }}
          className="block text-sm font-medium text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="w-4 h-4 text-gray-400" />
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}

export default Input