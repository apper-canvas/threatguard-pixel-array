import { toast } from 'react-toastify'

class KeywordService {
  constructor() {
    this.tableName = 'keyword'
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
          { field: { Name: "term" } },
          { field: { Name: "category" } },
          { field: { Name: "severity" } },
          { field: { Name: "is_active" } },
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
        isActive: item.is_active
      }))
    } catch (error) {
      console.error('Error fetching keywords:', error)
      throw error
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initClient()
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "term" } },
          { field: { Name: "category" } },
          { field: { Name: "severity" } },
          { field: { Name: "is_active" } },
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
        isActive: response.data.is_active
      }
    } catch (error) {
      console.error(`Error fetching keyword with ID ${id}:`, error)
      throw error
    }
  }

  async create(keyword) {
    try {
      if (!this.apperClient) this.initClient()
      
      const params = {
        records: [{
          term: keyword.term,
          category: keyword.category,
          severity: keyword.severity,
          is_active: keyword.isActive !== undefined ? keyword.isActive : true
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
          
          throw new Error('Failed to create keyword')
        }
        
        const created = response.results[0].data
        return {
          ...created,
          isActive: created.is_active
        }
      }
    } catch (error) {
      console.error('Error creating keyword:', error)
      throw error
    }
  }

  async update(id, updatedData) {
    try {
      if (!this.apperClient) this.initClient()
      
      const updateFields = {}
      if (updatedData.term !== undefined) updateFields.term = updatedData.term
      if (updatedData.category !== undefined) updateFields.category = updatedData.category
      if (updatedData.severity !== undefined) updateFields.severity = updatedData.severity
      if (updatedData.isActive !== undefined) updateFields.is_active = updatedData.isActive
      
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
          
          throw new Error('Failed to update keyword')
        }
        
        const updated = response.results[0].data
        return {
          ...updated,
          isActive: updated.is_active
        }
      }
    } catch (error) {
      console.error(`Error updating keyword with ID ${id}:`, error)
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
          
          throw new Error('Failed to delete keyword')
        }
        
        return { success: true }
      }
    } catch (error) {
      console.error(`Error deleting keyword with ID ${id}:`, error)
      throw error
    }
  }

  async getActive() {
    try {
      const allKeywords = await this.getAll()
      return allKeywords.filter(keyword => keyword.isActive)
    } catch (error) {
      console.error('Error fetching active keywords:', error)
      throw error
    }
  }

  async toggleActive(id) {
    try {
      const keyword = await this.getById(id)
      return this.update(id, { isActive: !keyword.isActive })
    } catch (error) {
      console.error(`Error toggling keyword with ID ${id}:`, error)
      throw error
    }
  }
}

export default new KeywordService()