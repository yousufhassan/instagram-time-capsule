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
            const searchQuery = mysql.format(sqlSearch, [username]);

            await connection.query(searchQuery, async (err, result) => {
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
                    const insertQuery = mysql.format(sqlInsert, [username, hashedPassword]);
                    await connection.query(insertQuery, (err, result) => {
                        connection.release();
                        if (err) throw (err)
                        console.log("--- Created new User ---")
                        console.log("userID = " + result.insertId)
                        // console.log(res);
                        res.json({ username: username, password: hashedPassword })
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
            const searchQuery = mysql.format(sqlSearch, [username])
            await connection.query(searchQuery, async (err, result) => {
                connection.release()

                if (err) throw (err)
                if (result.length == 0) {
                    console.log("--- User does not exist ---")
                    res.sendStatus(404)
                }
                else {
                    const hashedPassword = result[0].password
                    //get the hashedPassword from result
                    if (await bcrypt.compare(password, hashedPassword)) {
                        console.log("--- Login Successful ---")
                        // res.send(`${username} is logged in!`)
                        res.json({ username: username, password: hashedPassword })
                    }
                    else {
                        console.log("--- Password Incorrect ---")
                        res.send("Password incorrect!")
                        // res.sendStatus(401)
                    } //end of bcrypt.compare()
                }//end of User exists i.e. results.length==0
            }) //end of connection.query()
        }) //end of db.connection()
    } //end of app.post()

    async uploadData(req, res, chatOwner: string, chatTitle: string) {
        this.addChat(req, res, chatOwner, chatTitle).then(function (val) {
            console.log("val: " + val);
        })
    }

    async addChat(req, res, chatOwner: string, chatTitle: string) {
        this.con.getConnection(async (err, connection) => {
            if (err) throw (err)

            // Get the userID of the chatOwner
            const getUserIDSearch = "SELECT user_id FROM Users WHERE username = ?"
            const getUserIDSQuery = mysql.format(getUserIDSearch, [chatOwner])
            await connection.query(getUserIDSQuery, async (err, result) => {
                if (err) throw (err)
                // console.log(result[0].user_id);
                // assert(result.length != 0) // since this user is logged in, they must be in database
                let userID = result[0].user_id

                // If this chat already exists in the database, delete those
                // entries along with their corresponding conversations in the
                // conversations table
                const findChatSearch = "SELECT * FROM Chats WHERE title = ?"
                const findChatQuery = mysql.format(findChatSearch, [chatTitle])
                await connection.query(findChatQuery, async (err, result) => {
                    if (err) throw (err)
                    if (result.length == 0) {
                        console.log("--- Chat does not exist in database ---")
                        // result.sendStatus(404)
                    }
                    else {
                        // Chat exists in database, so we will delete it
                        const deleteChatSearch = "DELETE FROM Chats WHERE title = ?"
                        const deleteChatQuery = mysql.format(deleteChatSearch, [chatTitle])
                        await connection.query(deleteChatQuery, async (err, result) => {
                            if (err) throw (err)
                            console.log("--- Chat deleted ---");
                            // console.log(result);
                        })
                    }
                    // At this point, this chat (with title: chatTitle) does not exist in the database
                    // so we will add it now.
                    const addChatSQL = "INSERT INTO Chats(chat_owner_id, title) VALUES (?,?)"
                    const addChatQuery = mysql.format(addChatSQL, [userID, chatTitle])
                    await connection.query(addChatQuery, async (err, result) => {
                        connection.release();
                        if (err) throw (err)
                        console.log("-- Added new chat --");
                        console.log("chat_owner: " + chatOwner + ", chat_title: " + chatTitle);

                        // TODO: Figure out what status to send
                        // console.log(result.insertId);

                        return result.insertId
                        // res.json({temp: "asdf"})
                    })
                })
            })
        })
    }

    async addConversation(date: string, conversation: JSON[]) {
        this.con.getConnection(async (err, connection) => {
            if (err) throw (err)

            // If this conversation data and conversation already exists in the database
            // then delete it
            const conversationSearch = "SELECT * FROM Conversations WHERE date"

            // Add conversation to the database
        })
    }
}
