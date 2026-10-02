const DB_KEY = 'nash-ai-workshop-db'

type DatabaseShape = Record<string, unknown[]>

const canUseStorage = () => typeof window !== 'undefined'

const readDatabase = (): DatabaseShape => {
  if (!canUseStorage()) {
    return {}
  }

  const rawValue = window.localStorage.getItem(DB_KEY)

  if (!rawValue) {
    return {}
  }

  try {
    const parsed = JSON.parse(rawValue) as unknown

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return {}
    }

    return parsed as DatabaseShape
  } catch {
    return {}
  }
}

const writeDatabase = (db: DatabaseShape) => {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(DB_KEY, JSON.stringify(db))
}

const getTable = <T>(tableName: string): T[] => {
  const db = readDatabase()
  const table = db[tableName]

  if (!Array.isArray(table)) {
    return []
  }

  return table as T[]
}

const setTable = <T>(tableName: string, rows: T[]) => {
  const db = readDatabase()
  db[tableName] = rows
  writeDatabase(db)
}

const insertOne = <T>(tableName: string, row: T) => {
  const table = getTable<T>(tableName)
  table.push(row)
  setTable(tableName, table)
  return row
}

const findOne = <T>(tableName: string, predicate: (row: T) => boolean) => {
  const table = getTable<T>(tableName)
  return table.find(predicate)
}

const updateOne = <T>(
  tableName: string,
  predicate: (row: T) => boolean,
  updater: (row: T) => T,
) => {
  const table = getTable<T>(tableName)
  const index = table.findIndex(predicate)

  if (index === -1) {
    return undefined
  }

  const updatedRow = updater(table[index])
  table[index] = updatedRow
  setTable(tableName, table)

  return updatedRow
}

const deleteOne = <T>(tableName: string, predicate: (row: T) => boolean) => {
  const table = getTable<T>(tableName)
  const nextRows = table.filter((row) => !predicate(row))

  if (nextRows.length === table.length) {
    return false
  }

  setTable(tableName, nextRows)
  return true
}

const clearTable = (tableName: string) => {
  setTable(tableName, [])
}

export const localDb = {
  getTable,
  setTable,
  insertOne,
  findOne,
  updateOne,
  deleteOne,
  clearTable,
}
