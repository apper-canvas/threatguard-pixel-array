import keywordData from '../mockData/keywords.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

class KeywordService {
  constructor() {
    this.data = [...keywordData]
  }

  async getAll() {
    await delay(300)
    return [...this.data]
  }

  async getById(id) {
    await delay(200)
    const keyword = this.data.find(item => item.Id === parseInt(id, 10))
    if (!keyword) {
      throw new Error('Keyword not found')
    }
    return { ...keyword }
  }

  async create(keyword) {
    await delay(400)
    const maxId = Math.max(...this.data.map(item => item.Id), 0)
    const newKeyword = {
      ...keyword,
      Id: maxId + 1,
      isActive: keyword.isActive !== undefined ? keyword.isActive : true
    }
    this.data.push(newKeyword)
    return { ...newKeyword }
  }

  async update(id, updatedData) {
    await delay(350)
    const index = this.data.findIndex(item => item.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Keyword not found')
    }
    
    const { Id, ...updateFields } = updatedData
    this.data[index] = { ...this.data[index], ...updateFields }
    return { ...this.data[index] }
  }

  async delete(id) {
    await delay(250)
    const index = this.data.findIndex(item => item.Id === parseInt(id, 10))
    if (index === -1) {
      throw new Error('Keyword not found')
    }
    
    const deleted = this.data.splice(index, 1)[0]
    return { ...deleted }
  }

  async getActive() {
    await delay(300)
    return this.data.filter(keyword => keyword.isActive).map(item => ({ ...item }))
  }

  async toggleActive(id) {
    await delay(200)
    const keyword = await this.getById(id)
    return this.update(id, { isActive: !keyword.isActive })
  }
}

export default new KeywordService()