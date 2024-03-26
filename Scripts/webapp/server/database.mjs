import mysql from 'mysql2'

export class Database {
    constructor(dbparams) {
        this.pool = mysql.createPool(dbparams).promise()
    }

    async query(sql, params = []){
        const [rows] = await this.pool.execute(sql, params)
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



}