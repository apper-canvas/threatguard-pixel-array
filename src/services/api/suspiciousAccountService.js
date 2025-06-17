import { toast } from 'react-toastify'

class SuspiciousAccountService {
  constructor() {
    this.tableName = 'suspicious_account'
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
          { field: { Name: "username" } },
          { field: { Name: "threat_score" } },
          { field: { Name: "flags" } },
          { field: { Name: "first_seen" } },
          { field: { Name: "interactions" } },
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
        threatScore: item.threat_score,
        firstSeen: item.first_seen,
        flags: typeof item.flags === 'string' ? item.flags.split(',') : item.flags || []
      }))
    } catch (error) {
      console.error('Error fetching suspicious accounts:', error)
      throw error
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initClient()
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "username" } },
          { field: { Name: "threat_score" } },
          { field: { Name: "flags" } },
          { field: { Name: "first_seen" } },
          { field: { Name: "interactions" } },
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
        threatScore: response.data.threat_score,
        firstSeen: response.data.first_seen,
        flags: typeof response.data.flags === 'string' ? response.data.flags.split(',') : response.data.flags || []
      }
    } catch (error) {
      console.error(`Error fetching suspicious account with ID ${id}:`, error)
      throw error
    }
  }

  async create(account) {
    try {
      if (!this.apperClient) this.initClient()
      
      const params = {
        records: [{
          username: account.username,
          threat_score: account.threatScore || 0,
          flags: Array.isArray(account.flags) ? account.flags.join(',') : account.flags,
          first_seen: account.firstSeen || new Date().toISOString(),
          interactions: account.interactions || 0
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
          
          throw new Error('Failed to create suspicious account')
        }
        
        const created = response.results[0].data
        return {
          ...created,
          threatScore: created.threat_score,
          firstSeen: created.first_seen,
          flags: typeof created.flags === 'string' ? created.flags.split(',') : created.flags || []
        }
      }
    } catch (error) {
      console.error('Error creating suspicious account:', error)
      throw error
    }
  }

  async update(id, updatedData) {
    try {
      if (!this.apperClient) this.initClient()
      
      const updateFields = {}
      if (updatedData.username !== undefined) updateFields.username = updatedData.username
      if (updatedData.threatScore !== undefined) updateFields.threat_score = updatedData.threatScore
      if (updatedData.flags !== undefined) updateFields.flags = Array.isArray(updatedData.flags) ? updatedData.flags.join(',') : updatedData.flags
      if (updatedData.firstSeen !== undefined) updateFields.first_seen = updatedData.firstSeen
      if (updatedData.interactions !== undefined) updateFields.interactions = updatedData.interactions
      
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
          
          throw new Error('Failed to update suspicious account')
        }
        
        const updated = response.results[0].data
        return {
          ...updated,
          threatScore: updated.threat_score,
          firstSeen: updated.first_seen,
          flags: typeof updated.flags === 'string' ? updated.flags.split(',') : updated.flags || []
        }
      }
    } catch (error) {
      console.error(`Error updating suspicious account with ID ${id}:`, error)
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
          
          throw new Error('Failed to delete suspicious account')
        }
        
        return { success: true }
      }
    } catch (error) {
      console.error(`Error deleting suspicious account with ID ${id}:`, error)
      throw error
    }
  }

  async getByThreatScore(minScore) {
    try {
      const allAccounts = await this.getAll()
      return allAccounts.filter(account => account.threatScore >= minScore)
    } catch (error) {
      console.error(`Error fetching accounts by threat score ${minScore}:`, error)
      throw error
    }
  }
}

export default new SuspiciousAccountService()