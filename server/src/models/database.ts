require("dotenv").config()
const mysql = require('mysql');
const bcrypt = require("bcrypt")

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

    /**
     * Connects to the MySQL database using the connection object and logs the connection status.
     * @function
     * @returns {void}
     */
    connectToDB(): void {
        this.con.getConnection(function (err, connection) {
            if (err) throw err;
            console.log("Database connected successful: " + connection.threadId);
        });
    }

    /**
     * Creates a new user in a MySQL database based on the provided request object.
     * @async
     * @param {Object} req - The HTTP request object containing the user's username and password in the request body.
     * @param {Object} res - The HTTP response object to send back to the client.
     * @returns {Promise<void>}
     */
    async createUser(req, res) {
        // Extract username and hashed password from request body
        const username = req.body.username;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Obtain a connection to the MySQL database
        this.con.getConnection(async (err, connection) => {
            if (err) throw (err);
            // Search for existing user with same username
            const sqlSearch = "SELECT * FROM Users WHERE username = ?";
            const search_query = mysql.format(sqlSearch, [username]);

            await connection.query(search_query, async (err, result) => {
                if (err) throw (err)
                if (result.length !== 0) {
                    // User already exists, send conflict status code and release connection
                    connection.release();
                    console.log("--- User already exists ---")
                    res.sendStatus(409);
                }
                else {
                    // Insert new user into database and send created status code
                    const sqlInsert = "INSERT INTO Users(username, password) VALUES (?,?)";
                    const insert_query = mysql.format(sqlInsert, [username, hashedPassword]);
                    await connection.query(insert_query, (err, result) => {
                        connection.release();
                        if (err) throw (err)
                        console.log("--- Created new User ---")
                        console.log("userID = " + result.insertId)
                        // console.log(res);
                        res.json({username: username, password: hashedPassword})
                    })
                }
            })
        })
    }

    async login(req, res) {
        const username = req.body.username;
        const password = req.body.password;

        this.con.getConnection(async (err, connection) => {
            if (err) throw (err)
            const sqlSearch = "Select * from Users where username = ?"
            const search_query = mysql.format(sqlSearch, [username])
            await connection.query(search_query, async (err, result) => {
                connection.release()

                if (err) throw (err)
                if (result.length == 0) {
                    console.log("--------> User does not exist")
                    res.sendStatus(404)
                }
                else {
                    const hashedPassword = result[0].password
                    //get the hashedPassword from result
                    if (await bcrypt.compare(password, hashedPassword)) {
                        console.log("---------> Login Successful")
                        res.send(`${username} is logged in!`)
                    }
                    else {
                        console.log("---------> Password Incorrect")
                        res.send("Password incorrect!")
                        // res.sendStatus(401)
                    } //end of bcrypt.compare()
                }//end of User exists i.e. results.length==0
            }) //end of connection.query()
        }) //end of db.connection()
    } //end of app.post()
}
