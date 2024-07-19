import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';
import https from 'https';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import { Database } from './database.mjs';

dotenv.config({path: './server/.env'})

// Resolve __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT || 3000;

// const options = {
//   key: fs.readFileSync(process.env.KEY_PATH).toString(),
//   cert: fs.readFileSync(process.env.CERT_PATH).toString(),
//   ciphers: 'ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA:ECDHE-RSA-AES256-SHA384',
//   honorCipherOrder: true,
//   secureProtocol: 'TLSv1_2_method'
// };

const options = {
  key: fs.readFileSync(process.env.KEY_PATH).toString(),
  cert: fs.readFileSync(process.env.CERT_PATH).toString()
};


// Use CORS middleware to allow requests from localhost:3000
app.use(cors({
  origin: ['https://localhost:3000', 'https://127.0.0.1:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));

// Serve static files from the Vite app build directory
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

const server = https.createServer(options, app);
// const sio = new Server(server);

// Initialize socket.io with the HTTPS server
const sio = new Server(server, {
  cors: {
    origin: ['https://localhost:3000', 'https://127.0.0.1:3000'],
    methods: ["GET", "POST"],
    credentials: true
  }
});

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
      return tables;
  } catch (error) {
      console.error('Error listing tables:', error);
  }
}

async function listTableData(tableName) {
  console.log("Table Name:", tableName);
  try {
      const tableData = await db.getTableData(tableName);
      console.log('Data:', tableData);
      return tableData;
  } catch (error) {
      console.error('Error listing data:', error);
  }
}

async function listTableColumns(tableName){
  console.log("Table Name:", tableName);
  try {
      const tableColumns = await db.getColumnNames(tableName);
      console.log('Columns:', tableColumns);
      return tableColumns;
  } catch (error) {
      console.error('Error listing columns:', error);
  }
}

async function listFirstRowData(tableName, index){
    try {
      const rowData = await db.getRowData(tableName, index);
      console.log('Data:', rowData);
      return rowData;
    } catch (error) {
        console.error('Error listing data:', error);
    }
}

async function mainass() {
  const tables = await listDatabaseTables();
  console.log(tables);
  const firstTableData = await listTableData(tables[0]);
  const firstTableColumsn = await listTableColumns(tables[0]);
  const firstRowData = await listFirstRowData(tables[0], 1);
  // const secondTableData = await listTableData(tables[1]);
}


mainass();


sio.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


// Define a route for "/"
app.get('/', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Serve the Vite app for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
