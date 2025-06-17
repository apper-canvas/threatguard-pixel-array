import threatData from '../mockData/threats.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class ThreatService {
  constructor() {
    this.data = [...threatData]
  }

  async getAll() {
    await delay(300)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const threat = this.data.find(item => item.Id === parseInt(id, 10))
    if (!threat) {
      throw new Error('Threat not found')
    }
    return { ...threat }
  }

  async create(threat) {
    await delay(400)
    const maxId = Math.max(...this.data.map(item => item.Id), 0)
    const newThreat = {
      ...threat,
      Id: maxId + 1,
      timestamp: new Date().toISOString(),
      status: threat.status || 'active'
    }
    this.data.push(newThreat)
    return { ...newThreat }
  }

  async update(id, updatedData) {
    await delay(350)
    const index = this.data.findIndex(item => item.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Threat not found')
    }
    
    const { Id, ...updateFields } = updatedData
    this.data[index] = { ...this.data[index], ...updateFields }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.data.findIndex(item => item.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Threat not found')
    }
    
    const deleted = this.data.splice(index, 1)[0]
    return { ...deleted }
  }

  async getByStatus(status) {
    await delay(300)
    return this.data.filter(threat => threat.status === status).map(item => ({ ...item }))
  }

  async getBySeverity(severity) {
    await delay(300)
    return this.data.filter(threat => threat.severity === severity).map(item => ({ ...item }))
  }
}

export default new ThreatService()