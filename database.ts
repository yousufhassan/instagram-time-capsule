import res from "express/lib/response";

var mysql = require('mysql');

export class database {
    con: any;

    constructor() {
        this.con = mysql.createConnection({
            host: "127.0.0.1",
            port: "3306",
            database: "instagram_chat",
            user: "root",
            password: "ct8a@*4@V5m6@@$B"
        })
    }

    connectToDB(): void {
        this.con.connect(function (err) {
            if (err) throw err;
            console.log("Connected!");
        });
    }

    addUser(username: string, password: string): void {
        let query = `insert into Users (username, password) values (?, ?)`;
        let params = [username, password];
        this.con.query(query, params);
        console.log("Successfully added user.");
    }
}


