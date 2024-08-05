import mysql from 'mysql2'

export class Database {
    constructor(dbparams) {
        this.pool = mysql.createPool(dbparams).promise()
    }

    async query(sql, params = []){
        const [rows] = await this.pool.execute(sql, params)
        console.log("Query: ", sql, params);
        return rows
    }

    async connect(){
        try {
            const connection = await this.pool.getConnection()
            console.log("MySQL DB Connected");
            return true
        } catch (error) {
            console.error(error);
            return false
        }
    }

    async listTables(){
        const query = "SHOW TABLES"

        try {
            const rows = await this.query(query)
            const tables = rows.map(row => Object.values(row)[0])
            
            return tables
        } catch (error) {
            console.error("Failed to list tables", error);
            return false          
        }
    }

    async getTableData(tableName){
        const sanitizedTableName = mysql.escapeId(tableName);
        // console.log(sanitizedTableName);
        const query = `SELECT * FROM ${sanitizedTableName}`;
        
        try {
            const rows = await this.query(query);
            return rows;

        } catch (error) {
            console.error(`Failed to fetch data from table ${tableName}`, error);
            return false;
        }    
    }

    async getRowData(tableName, index){
        if (index < 1) {
            index = 1;
        }

        const sanitizedTableName = mysql.escapeId(tableName);
        const query = `SELECT * FROM ${sanitizedTableName} WHERE id = ? LIMIT 1`;
        console.log("Row Data Q: ", query);

        try {
            const rows = await this.query(query, [index]);
            return rows.length > 0 ? rows[0] : null; // Ensure only one row or null is returned

        } catch (error) {
            console.error(`Failed to fetch data from table ${tableName}`, error);
            return false;
        }
    }

    async getColumnNames(tableName) {
        const sanitizedTableName = mysql.escapeId(tableName);
        const query = `SHOW COLUMNS FROM ${sanitizedTableName}`;
        try {
            const rows = await this.query(query);
            const columnNames = rows.map(row => row.Field);
            return columnNames;
        } catch (error) {
            console.error(`Failed to fetch column names from table ${tableName}:`, error);
            return false;
        }
    }

    async insertRow(tableName, rowData){
        const sanitizedTableName = mysql.escapeId(tableName);

        const columns = Object.keys(rowData).map(col => mysql.escapeId(col)).join(', '); // Get the columns from the data
        const dataPlaceholders = Object.keys(rowData).map(() => "?").join(', ');         // Make the placeholders to insert the data with the mysql module
        const dataValues = Object.values(rowData);

        const query = `INSERT INTO ${sanitizedTableName} (${columns}) VALUES (${dataPlaceholders})`;

        try {
            const result = await this.query(query, dataValues);
            console.log(`Inserted ${result.affectedRows} row(s) into ${tableName}`);
            return result.insertId;
        } catch (error) {
            console.error(`Failed to add row to table ${tableName}:`, error);
            return false;
        }
    }

}