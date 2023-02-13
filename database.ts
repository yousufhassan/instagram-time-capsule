const mysql = require('mysql');
require("dotenv").config()

const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT


export class database {
    con: any;

    constructor() {
        this.con = mysql.createPool({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_DATABASE
        })
    }

    connectToDB(): void {
        this.con.getConnection(function (err, connection) {
            if (err) throw err;
            console.log("Database connected successful: " + connection.threadId);
        });
    }

    addUser(username: string, password: string): void {
        let query = `insert into Users (username, password) values (?, ?)`;
        let params = [username, password];
        this.con.query(query, params);
        console.log("Successfully added user.");
    }
}


