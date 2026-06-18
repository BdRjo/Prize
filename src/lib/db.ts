import fs from 'fs'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

function getFilePath(collection: string): string {
  return path.join(DATA_DIR, `${collection}.json`)
}

export function readCollection<T>(collection: string): T[] {
  const filePath = getFilePath(collection)
  if (!fs.existsSync(filePath)) {
    return []
  }
  try {
    const data = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(data) as T[]
  } catch {
    return []
  }
}

export function writeCollection<T>(collection: string, data: T[]): void {
  const filePath = getFilePath(collection)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function findById<T extends { id: string }>(collection: string, id: string): T | undefined {
  const data = readCollection<T>(collection)
  return data.find(item => item.id === id)
}

export function createItem<T extends { id: string }>(collection: string, item: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; createdAt?: string; updatedAt?: string }): T {
  const data = readCollection<T>(collection)
  const now = new Date().toISOString()
  const newItem = {
    ...item,
    id: item.id || generateId(),
    createdAt: item.createdAt || now,
    updatedAt: now,
  } as unknown as T
  data.push(newItem)
  writeCollection(collection, data)
  return newItem
}

export function updateItem<T extends { id: string }>(collection: string, id: string, updates: Partial<T>): T | null {
  const data = readCollection<T>(collection)
  const index = data.findIndex(item => item.id === id)
  if (index === -1) return null
  data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() } as T
  writeCollection(collection, data)
  return data[index]
}

export function deleteItem<T extends { id: string }>(collection: string, id: string): boolean {
  const data = readCollection<T>(collection)
  const filtered = data.filter(item => item.id !== id)
  if (filtered.length === data.length) return false
  writeCollection(collection, filtered)
  return true
}

export function findByField<T>(collection: string, field: string, value: string): T | undefined {
  const data = readCollection<T>(collection)
  return data.find(item => (item as Record<string, unknown>)[field] === value)
}

export function findManyByField<T>(collection: string, field: string, value: unknown): T[] {
  const data = readCollection<T>(collection)
  return data.filter(item => (item as Record<string, unknown>)[field] === value)
}

export function count(collection: string): number {
  return readCollection(collection).length
}
