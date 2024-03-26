import dotenv from 'dotenv'
import express from 'express'
import { Database } from './database.mjs'

dotenv.config({path: './server/.env'})

const app = express();
const PORT = process.env.PORT || 3000;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'kicaddb'
}
console.log(dbConfig)

const db = new Database(dbConfig)
db.connect()

async function listDatabaseTables() {
  try {
      const tables = await db.listTables();
      console.log('Tables:', tables);
  } catch (error) {
      console.error('Error listing tables:', error);
  }
}

listDatabaseTables();

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
