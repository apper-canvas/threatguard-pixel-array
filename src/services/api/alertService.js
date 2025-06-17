import alertData from '../mockData/alerts.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class AlertService {
  constructor() {
    this.data = [...alertData]
  }

  async getAll() {
    await delay(300)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const alert = this.data.find(item => item.Id === parseInt(id, 10))
    if (!alert) {
      throw new Error('Alert not found')
    }
    return { ...alert }
  }

  async create(alert) {
    await delay(400)
    const maxId = Math.max(...this.data.map(item => item.Id), 0)
    const newAlert = {
      ...alert,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      isRead: false
    }
    this.data.push(newAlert)
    return { ...newAlert }
  }

  async update(id, updatedData) {
    await delay(350)
    const index = this.data.findIndex(item => item.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Alert not found')
    }
    
    const { Id, ...updateFields } = updatedData
    this.data[index] = { ...this.data[index], ...updateFields }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.data.findIndex(item => item.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Alert not found')
    }
    
    const deleted = this.data.splice(index, 1)[0]
    return { ...deleted }
  }

  async markAsRead(id) {
    await delay(200)
    return this.update(id, { isRead: true })
  }

  async getUnread() {
    await delay(300)
    return this.data.filter(alert => !alert.isRead).map(item => ({ ...item }))
  }
}

export default new AlertService()