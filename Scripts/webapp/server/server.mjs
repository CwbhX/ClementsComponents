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

const options = {
  key: fs.readFileSync(process.env.KEY_PATH).toString(),
  cert: fs.readFileSync(process.env.CERT_PATH).toString()
};


// Use CORS middleware to allow requests from localhost:3000
app.use(cors({
  origin: ['https://localhost:3000', 'https://127.0.0.1:3000', 'https://localhost:5173', 'https://127.0.0.1:5173',
           'http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
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
    origin: ['https://localhost:3000', 'https://127.0.0.1:3000', 'https://localhost:5173', 'https://127.0.0.1:5173',
             'http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
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

async function insertRow(tableName, rowData){
    try {
        const affectedRowID = await db.insertRow(tableName, rowData);
        console.log("Affected Row ID: ", affectedRowID);
        return affectedRowID;
    } catch (error) {
        console.error("Error inserting row", error);
    }
}

// async function mainass() {
//   const tables = await listDatabaseTables();
//   console.log(tables);
//   const firstTableData = await listTableData(tables[0]);
//   const firstTableColumsn = await listTableColumns(tables[0]);
//   const firstRowData = await listFirstRowData(tables[0], 1);
//   // const secondTableData = await listTableData(tables[1]);
// }



// mainass();


sio.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('getTables', async (callback) => {
      console.log("Request for sql tables");
      const tables = await listDatabaseTables();

      callback(tables);
  });

  socket.on('getTableData', async (tableName, callback) => {
      console.log(`Request for ${tableName}`);
      const tableData = await listTableData(tableName);

      callback(tableData);
  });

  socket.on('getTableInfo', async (tableName, callback) => {
      console.log(`Request for info from ${tableName}`);
      const tableInfo = await db.getTableInfo(tableName);

      callback(tableInfo);
  });

  socket.on('insertRow', async ({tableName, rowData}, callback) => {
      console.log(`Inserting row into ${tableName}`);
      console.log("Row Data: ", rowData);
      console.log("New Row Data: ", rowData);

      let rowID = await insertRow(tableName, rowData);

      if (rowID == false) rowID = -1; // Let client know we failed

      callback(rowID);
  })

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
