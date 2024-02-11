import mysql from 'mysql2.promise'

class Database {
    constructor(dbparams) {
        this.pool = mysql.createPool(dbparams)
    }

    async connect(){
        try {
            const connection = await this.pool.getConnection()
            console.log("MySQL DB Connected");
        } catch (error) {
            console.error(error);
        }
    }


}