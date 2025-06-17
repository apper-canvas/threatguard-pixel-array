import accountData from '../mockData/suspiciousAccounts.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class SuspiciousAccountService {
  constructor() {
    this.data = [...accountData]
  }

  async getAll() {
    await delay(300)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const account = this.data.find(item => item.Id === parseInt(id, 10))
    if (!account) {
      throw new Error('Account not found')
    }
    return { ...account }
  }

  async create(account) {
    await delay(400)
    const maxId = Math.max(...this.data.map(item => item.Id), 0)
    const newAccount = {
      ...account,
      Id: maxId + 1,
      firstSeen: account.firstSeen || new Date().toISOString()
    }
    this.data.push(newAccount)
    return { ...newAccount }
  }

  async update(id, updatedData) {
    await delay(350)
    const index = this.data.findIndex(item => item.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Account not found')
    }
    
    const { Id, ...updateFields } = updatedData
    this.data[index] = { ...this.data[index], ...updateFields }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.data.findIndex(item => item.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Account not found')
    }
    
    const deleted = this.data.splice(index, 1)[0]
    return { ...deleted }
  }

  async getByThreatScore(minScore) {
    await delay(300)
    return this.data.filter(account => account.threatScore >= minScore).map(item => ({ ...item }))
  }
}

export default new SuspiciousAccountService()