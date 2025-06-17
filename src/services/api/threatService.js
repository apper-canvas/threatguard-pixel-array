import { toast } from 'react-toastify'

class ThreatService {
  constructor() {
    this.tableName = 'threat'
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
          { field: { Name: "type" } },
          { field: { Name: "severity" } },
          { field: { Name: "source" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "status" } },
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
      
      return response.data || []
    } catch (error) {
      console.error('Error fetching threats:', error)
      throw error
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initClient()
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "severity" } },
          { field: { Name: "source" } },
          { field: { Name: "content" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "status" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id, 10), params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching threat with ID ${id}:`, error)
      throw error
    }
  }

  async create(threat) {
    try {
      if (!this.apperClient) this.initClient()
      
      const params = {
        records: [{
          type: threat.type,
          severity: threat.severity,
          source: threat.source,
          content: threat.content,
          timestamp: threat.timestamp || new Date().toISOString(),
          status: threat.status || 'active'
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
          
          throw new Error('Failed to create threat')
        }
        
        return response.results[0].data
      }
    } catch (error) {
      console.error('Error creating threat:', error)
      throw error
    }
  }

  async update(id, updatedData) {
    try {
      if (!this.apperClient) this.initClient()
      
      const updateFields = {}
      if (updatedData.type !== undefined) updateFields.type = updatedData.type
      if (updatedData.severity !== undefined) updateFields.severity = updatedData.severity
      if (updatedData.source !== undefined) updateFields.source = updatedData.source
      if (updatedData.content !== undefined) updateFields.content = updatedData.content
      if (updatedData.timestamp !== undefined) updateFields.timestamp = updatedData.timestamp
      if (updatedData.status !== undefined) updateFields.status = updatedData.status
      
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
          
          throw new Error('Failed to update threat')
        }
        
        return response.results[0].data
      }
    } catch (error) {
      console.error(`Error updating threat with ID ${id}:`, error)
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
          
          throw new Error('Failed to delete threat')
        }
        
        return { success: true }
      }
    } catch (error) {
      console.error(`Error deleting threat with ID ${id}:`, error)
      throw error
    }
  }

  async getByStatus(status) {
    try {
      const allThreats = await this.getAll()
      return allThreats.filter(threat => threat.status === status)
    } catch (error) {
      console.error(`Error fetching threats by status ${status}:`, error)
      throw error
    }
  }

  async getBySeverity(severity) {
    try {
      const allThreats = await this.getAll()
      return allThreats.filter(threat => threat.severity === severity)
    } catch (error) {
      console.error(`Error fetching threats by severity ${severity}:`, error)
      throw error
    }
  }
}

export default new ThreatService()