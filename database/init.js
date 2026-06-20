import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

export function initDatabase(db) {
  const schema = readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8')
  db.exec(schema)

  const hasRooms = db.prepare('SELECT COUNT(*) as count FROM rooms').get()
  if (hasRooms.count === 0) {
    const seed = readFileSync(path.join(__dirname, 'seed.sql'), 'utf-8')
    db.exec(seed)
    console.log('Base de datos inicializada con datos de prueba')
  }
}
