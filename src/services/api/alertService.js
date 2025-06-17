import { toast } from 'react-toastify'

class AlertService {
  constructor() {
    this.tableName = 'alert'
    this.apperClient = null
    this.initClient()
  }

  initClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initClient()
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "threat_id" } },
          { field: { Name: "message" } },
          { field: { Name: "priority" } },
          { field: { Name: "is_read" } },
          { field: { Name: "created_at" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "CreatedOn" } },
          { field: { Name: "ModifiedOn" } }
        ]
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data.map(item => ({
        ...item,
        threatId: item.threat_id,
        isRead: item.is_read,
        createdAt: item.created_at
      }))
    } catch (error) {
      console.error('Error fetching alerts:', error)
      throw error
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initClient()
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "threat_id" } },
          { field: { Name: "message" } },
          { field: { Name: "priority" } },
          { field: { Name: "is_read" } },
          { field: { Name: "created_at" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id, 10), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return {
        ...response.data,
        threatId: response.data.threat_id,
        isRead: response.data.is_read,
        createdAt: response.data.created_at
      }
    } catch (error) {
      console.error(`Error fetching alert with ID ${id}:`, error)
      throw error
    }
  }

  async create(alert) {
    try {
      if (!this.apperClient) this.initClient()
      
      const params = {
        records: [{
          threat_id: alert.threatId,
          message: alert.message,
          priority: alert.priority,
          is_read: alert.isRead !== undefined ? alert.isRead : false,
          created_at: alert.createdAt || new Date().toISOString()
        }]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
          
          throw new Error('Failed to create alert')
        }
        
        const created = response.results[0].data
        return {
          ...created,
          threatId: created.threat_id,
          isRead: created.is_read,
          createdAt: created.created_at
        }
      }
    } catch (error) {
      console.error('Error creating alert:', error)
      throw error
    }
  }

  async update(id, updatedData) {
    try {
      if (!this.apperClient) this.initClient()
      
      const updateFields = {}
      if (updatedData.threatId !== undefined) updateFields.threat_id = updatedData.threatId
      if (updatedData.message !== undefined) updateFields.message = updatedData.message
      if (updatedData.priority !== undefined) updateFields.priority = updatedData.priority
      if (updatedData.isRead !== undefined) updateFields.is_read = updatedData.isRead
      if (updatedData.createdAt !== undefined) updateFields.created_at = updatedData.createdAt
      
      const params = {
        records: [{
          Id: parseInt(id, 10),
          ...updateFields
        }]
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
          
          throw new Error('Failed to update alert')
        }
        
        const updated = response.results[0].data
        return {
          ...updated,
          threatId: updated.threat_id,
          isRead: updated.is_read,
          createdAt: updated.created_at
        }
      }
    } catch (error) {
      console.error(`Error updating alert with ID ${id}:`, error)
      throw error
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initClient()
      
      const params = {
        RecordIds: [parseInt(id, 10)]
      }
      
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`)
          
          failedRecords.forEach(record => {
            if (record.message) toast.error(record.message)
          })
          
          throw new Error('Failed to delete alert')
        }
        
        return { success: true }
      }
    } catch (error) {
      console.error(`Error deleting alert with ID ${id}:`, error)
      throw error
    }
  }

  async markAsRead(id) {
    try {
      return this.update(id, { isRead: true })
    } catch (error) {
      console.error(`Error marking alert as read with ID ${id}:`, error)
      throw error
    }
  }

  async getUnread() {
    try {
      const allAlerts = await this.getAll()
      return allAlerts.filter(alert => !alert.isRead)
    } catch (error) {
      console.error('Error fetching unread alerts:', error)
      throw error
    }
  }
}

export default new AlertService()