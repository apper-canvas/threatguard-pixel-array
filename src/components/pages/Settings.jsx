import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Card from '@/components/atoms/Card'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      weeklyReports: false,
      threatLevelThreshold: 'medium'
    },
    scanning: {
      autoScan: true,
      scanFrequency: '6hours',
      deepScan: false,
      scanComments: true,
      scanDMs: true,
      scanFollowers: false
    },
    privacy: {
      dataRetention: '90days',
      shareData: false,
      anonymousReports: true
    },
    advanced: {
      apiKey: '',
      webhookUrl: '',
      customRules: false
    }
  })

  const [activeSection, setActiveSection] = useState('notifications')

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
    toast.success('Setting updated')
  }

  const handleSaveSettings = () => {
    toast.success('All settings saved successfully')
  }

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      setSettings({
        notifications: {
          emailAlerts: true,
          pushNotifications: true,
          weeklyReports: false,
          threatLevelThreshold: 'medium'
        },
        scanning: {
          autoScan: true,
          scanFrequency: '6hours',
          deepScan: false,
          scanComments: true,
          scanDMs: true,
          scanFollowers: false
        },
        privacy: {
          dataRetention: '90days',
          shareData: false,
          anonymousReports: true
        },
        advanced: {
          apiKey: '',
          webhookUrl: '',
          customRules: false
        }
      })
      toast.success('Settings reset to defaults')
    }
  }

  const sections = [
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'scanning', label: 'Scanning', icon: 'Search' },
    { id: 'privacy', label: 'Privacy', icon: 'Shield' },
    { id: 'advanced', label: 'Advanced', icon: 'Settings' }
  ]

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">Email Alerts</h3>
          <p className="text-sm text-gray-400">Receive email notifications for critical threats</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifications.emailAlerts}
            onChange={(e) => handleSettingChange('notifications', 'emailAlerts', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-surface-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">Push Notifications</h3>
          <p className="text-sm text-gray-400">Get instant notifications on your device</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifications.pushNotifications}
            onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-surface-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">Weekly Reports</h3>
          <p className="text-sm text-gray-400">Receive weekly security summary reports</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifications.weeklyReports}
            onChange={(e) => handleSettingChange('notifications', 'weeklyReports', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-surface-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      <div>
        <h3 className="text-lg font-medium text-white mb-2">Threat Level Threshold</h3>
        <p className="text-sm text-gray-400 mb-4">Only notify me for threats at this level or higher</p>
        <select
          value={settings.notifications.threatLevelThreshold}
          onChange={(e) => handleSettingChange('notifications', 'threatLevelThreshold', e.target.value)}
          className="w-full px-3 py-2 bg-surface-700 border border-surface-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="low">Low and above</option>
          <option value="medium">Medium and above</option>
          <option value="high">High and above</option>
          <option value="critical">Critical only</option>
        </select>
      </div>
    </div>
  )

  const renderScanningSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">Auto Scan</h3>
          <p className="text-sm text-gray-400">Automatically scan for threats at regular intervals</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.scanning.autoScan}
            onChange={(e) => handleSettingChange('scanning', 'autoScan', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-surface-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      <div>
        <h3 className="text-lg font-medium text-white mb-2">Scan Frequency</h3>
        <p className="text-sm text-gray-400 mb-4">How often should automatic scans run?</p>
        <select
          value={settings.scanning.scanFrequency}
          onChange={(e) => handleSettingChange('scanning', 'scanFrequency', e.target.value)}
          disabled={!settings.scanning.autoScan}
          className="w-full px-3 py-2 bg-surface-700 border border-surface-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
        >
          <option value="1hour">Every hour</option>
          <option value="6hours">Every 6 hours</option>
          <option value="12hours">Every 12 hours</option>
          <option value="24hours">Daily</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">Deep Scan</h3>
          <p className="text-sm text-gray-400">Perform more thorough analysis (slower but more accurate)</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.scanning.deepScan}
            onChange={(e) => handleSettingChange('scanning', 'deepScan', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-surface-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Scan Sources</h3>
        <p className="text-sm text-gray-400">Choose what content to monitor</p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white">Comments</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.scanning.scanComments}
                onChange={(e) => handleSettingChange('scanning', 'scanComments', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white">Direct Messages</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.scanning.scanDMs}
                onChange={(e) => handleSettingChange('scanning', 'scanDMs', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-white">New Followers</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.scanning.scanFollowers}
                onChange={(e) => handleSettingChange('scanning', 'scanFollowers', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-2">Data Retention</h3>
        <p className="text-sm text-gray-400 mb-4">How long should we keep your security data?</p>
        <select
          value={settings.privacy.dataRetention}
          onChange={(e) => handleSettingChange('privacy', 'dataRetention', e.target.value)}
          className="w-full px-3 py-2 bg-surface-700 border border-surface-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="30days">30 days</option>
          <option value="90days">90 days</option>
          <option value="1year">1 year</option>
          <option value="forever">Keep forever</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">Share Data for Research</h3>
          <p className="text-sm text-gray-400">Help improve threat detection by sharing anonymized data</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.privacy.shareData}
            onChange={(e) => handleSettingChange('privacy', 'shareData', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-surface-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">Anonymous Reports</h3>
          <p className="text-sm text-gray-400">Submit reports to authorities without revealing your identity</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.privacy.anonymousReports}
            onChange={(e) => handleSettingChange('privacy', 'anonymousReports', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-surface-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      <Card className="border-warning bg-warning/10">
        <div className="flex items-start space-x-3">
          <ApperIcon name="Shield" className="w-5 h-5 text-warning mt-0.5" />
          <div>
            <h4 className="font-medium text-warning mb-1">Privacy Notice</h4>
            <p className="text-sm text-gray-300">
              Your privacy is important to us. We only collect data necessary for threat detection 
              and never share personal information without your explicit consent.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderAdvancedSettings = () => (
    <div className="space-y-6">
      <Card className="border-error bg-error/10">
        <div className="flex items-start space-x-3">
          <ApperIcon name="AlertTriangle" className="w-5 h-5 text-error mt-0.5" />
          <div>
            <h4 className="font-medium text-error mb-1">Advanced Settings</h4>
            <p className="text-sm text-gray-300">
              These settings are for advanced users only. Incorrect configuration may affect security monitoring.
            </p>
          </div>
        </div>
      </Card>

      <div>
        <h3 className="text-lg font-medium text-white mb-2">API Key</h3>
        <p className="text-sm text-gray-400 mb-4">Your Instagram API key for enhanced monitoring</p>
        <Input
          type="password"
          value={settings.advanced.apiKey}
          onChange={(e) => handleSettingChange('advanced', 'apiKey', e.target.value)}
          placeholder="Enter your API key..."
        />
      </div>

      <div>
        <h3 className="text-lg font-medium text-white mb-2">Webhook URL</h3>
        <p className="text-sm text-gray-400 mb-4">Send threat notifications to this webhook endpoint</p>
        <Input
          type="url"
          value={settings.advanced.webhookUrl}
          onChange={(e) => handleSettingChange('advanced', 'webhookUrl', e.target.value)}
          placeholder="https://your-webhook-url.com/alerts"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">Custom Rules Engine</h3>
          <p className="text-sm text-gray-400">Enable custom threat detection rules (Beta)</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.advanced.customRules}
            onChange={(e) => handleSettingChange('advanced', 'customRules', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-surface-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
      </div>

      {settings.advanced.customRules && (
        <Card>
          <div className="space-y-4">
            <h4 className="font-medium text-white">Custom Rule Configuration</h4>
            <p className="text-sm text-gray-400">
              Custom rules are currently in beta. Contact support for configuration assistance.
            </p>
            <Button variant="outline" size="small">
              Contact Support
            </Button>
          </div>
        </Card>
      )}
    </div>
  )

  const renderSettingsContent = () => {
    switch (activeSection) {
      case 'notifications':
        return renderNotificationSettings()
      case 'scanning':
        return renderScanningSettings()
      case 'privacy':
        return renderPrivacySettings()
      case 'advanced':
        return renderAdvancedSettings()
      default:
        return renderNotificationSettings()
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">
          Configure your security preferences and monitoring options
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <h2 className="text-lg font-semibold text-white mb-4">Settings</h2>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
                    activeSection === section.id
                      ? 'bg-primary text-white'
                      : 'text-gray-300 hover:bg-surface-700 hover:text-white'
                  }`}
                >
                  <ApperIcon name={section.icon} className="w-4 h-4" />
                  <span>{section.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">
                {sections.find(s => s.id === activeSection)?.label} Settings
              </h2>
              <Badge variant="info" size="small">
                Auto-save enabled
              </Badge>
            </div>
            
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderSettingsContent()}
            </motion.div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-surface-600">
              <Button
                variant="outline"
                onClick={handleResetSettings}
                icon="RotateCcw"
              >
                Reset to Defaults
              </Button>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => toast.info('Settings are automatically saved')}
                >
                  Changes saved automatically
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveSettings}
                  icon="Save"
                >
                  Save All Settings
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Additional Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-lg mx-auto mb-3">
                <ApperIcon name="Shield" className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium text-white mb-2">Security First</h3>
              <p className="text-sm text-gray-400">
                All data is encrypted and processed securely
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-success/20 rounded-lg mx-auto mb-3">
                <ApperIcon name="Zap" className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-medium text-white mb-2">Real-time</h3>
              <p className="text-sm text-gray-400">
                Instant notifications for immediate threats
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-info/20 rounded-lg mx-auto mb-3">
                <ApperIcon name="Users" className="w-6 h-6 text-info" />
              </div>
              <h3 className="font-medium text-white mb-2">Expert Support</h3>
              <p className="text-sm text-gray-400">
                24/7 support from security professionals
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Settings