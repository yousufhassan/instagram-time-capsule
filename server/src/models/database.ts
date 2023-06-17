import mysql from "mysql";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

// TODO: Instead of taking these consts from the .env file, put them in a TS file and structure it
// in whatever way is best. Then make the data types as appropriate.
// For now, I am hard coding the value that is giving a type error.
// const DB_HOST = process.env.DB_HOST;
// const DB_USER = process.env.DB_USER;
// const DB_PASSWORD = process.env.DB_PASSWORD;
// const DB_DATABASE = process.env.DB_DATABASE;
// const DB_PORT = 3306;

const DB_HOST = "127.0.0.1";
const DB_USER = "root";
const DB_PASSWORD = "ct8a@*4@V5m6@@$B";
const DB_DATABASE = "instagram_chat";
const DB_PORT = 3306;

export class database {
    con: any;

    constructor() {
        this.con = mysql.createPool({
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASSWORD,
            database: DB_DATABASE,
        });
    }

    /**
     * Connects to the MySQL database using the connection object and logs the connection status.
     * @function
     * @returns {void}
     */
    connectToDB(): void {
        this.con.getConnection(function (err: Error, connection: { threadId: string }) {
            if (err) throw err;
            console.log("Database connected successful: " + connection.threadId);
        });
    }

    /**
     * Creates a new user in a MySQL database based on the provided request object.
     * @async
     * @param {Request} req - The HTTP request object containing the user's username and password in the request body.
     * @param {Response} res - The HTTP response object to send back to the client.
     * @returns {Promise<void>}
     */
    async createUser(req: Request, res: Response) {
        // Extract username and hashed password from request body
        const username = req.body.username;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Obtain a connection to the MySQL database
        this.con.getConnection(async (err: Error, connection: any) => {
            if (err) throw err;
            // Search for existing user with same username
            const sqlSearch = "SELECT * FROM Users WHERE username = ?";
            const searchQuery = mysql.format(sqlSearch, [username]);

            await connection.query(searchQuery, async (err: Error, result: any) => {
                if (err) throw err;
                if (result.length !== 0) {
                    // User already exists, send conflict status code and release connection
                    connection.release();
                    console.log("--- User already exists ---");
                    res.sendStatus(409);
                } else {
                    // Insert new user into database and send created status code
                    const sqlInsert = "INSERT INTO Users(username, password) VALUES (?,?)";
                    const insertQuery = mysql.format(sqlInsert, [username, hashedPassword]);
                    await connection.query(insertQuery, (err: Error, result: any) => {
                        connection.release();
                        if (err) throw err;
                        console.log("--- Created new User ---");
                        console.log("userID = " + result.insertId);
                        // console.log(res);
                        res.json({ username: username, password: hashedPassword });
                    });
                }
            });
        });
    }

    /**
     * Performs user login if user with that username and password exists in the database.
     * @async
     * @param {Object} req - The HTTP request object containing the user's username and password in the request body.
     * @param {Object} res - The HTTP response object to send back to the client.
     * @returns {Promise<void>}
     */
    async login(req: Request, res: Response) {
        const username = req.body.username;
        const password = req.body.password;

        this.con.getConnection(async (err: Error, connection: any) => {
            if (err) throw err;
            const sqlSearch = "Select * from Users where username = ?";
            const searchQuery = mysql.format(sqlSearch, [username]);
            await connection.query(searchQuery, async (err: Error, result: any) => {
                connection.release();

                if (err) throw err;
                if (result.length == 0) {
                    console.log("--- User does not exist ---");
                    res.sendStatus(404);
                } else {
                    const hashedPassword = result[0].password;
                    //get the hashedPassword from result
                    if (await bcrypt.compare(password, hashedPassword)) {
                        console.log("--- Login Successful ---");
                        // res.send(`${username} is logged in!`)
                        res.json({ username: username, password: hashedPassword });
                    } else {
                        console.log("--- Password Incorrect ---");
                        res.send("Password incorrect!");
                        // res.sendStatus(401)
                    } //end of bcrypt.compare()
                } //end of User exists i.e. results.length==0
            }); //end of connection.query()
        }); //end of db.connection()
    } //end of app.post()

    /**
     * Get user ID from username.
     *
     * @param connection - The database connection.
     * @param req - The request object.
     * @param res - The response object.
     * @param username - The username of the user whose ID is to be retrieved.
     * @returns A promise that resolves to the user ID.
     */
    async getUserIdFromUsername(connection: any, username: string): Promise<number> {
        return new Promise(async function (resolve, reject) {
            const getUserIDSearch = "SELECT user_id FROM Users WHERE username = ?";
            const getUserIDSQuery = mysql.format(getUserIDSearch, [username]);
            await connection.query(getUserIDSQuery, async (err: Error, result: any) => {
                if (err) return reject(err);
                return resolve(result[0].user_id);
            });
        });
    }

    /**
     * Deletes a chat with the specified chatTitle. As a side effect, it will also delete all
     * conversations associated with this chat.
     *
     * @param connection - The database connection.
     * @param chatTitle - The title of the chat to be deleted.
     *
     * @returns True if the chat was deleted, and an error otherwise.
     * @throws Error if there is an error querying the database.
     */
    async deleteChat(connection: any, chatOwner: number, chatTitle: string): Promise<boolean> {
        return new Promise(async function (resolve, reject) {
            const findChatSearch = "SELECT * FROM Chats WHERE chat_owner_id = ? and title = ?";
            const findChatQuery = mysql.format(findChatSearch, [chatOwner, chatTitle]);
            await connection.query(findChatQuery, async (err: Error, result: any) => {
                if (err) return reject(err);

                if (result.length == 0) {
                    // Chat doesn't exist in database; nothing to delete.
                    console.log("--- Chat does not exist in database ---");
                    return resolve(true);
                    // result.sendStatus(404)
                } else {
                    // Chat exists in database, so deleting it.
                    const deleteChatSearch =
                        "DELETE FROM Chats WHERE chat_owner_id = ? and title = ?";
                    const deleteChatQuery = mysql.format(deleteChatSearch, [chatOwner, chatTitle]);
                    await connection.query(deleteChatQuery, async (err: Error) => {
                        if (err) throw err;
                        console.log("--- Chat deleted ---");
                        return resolve(true);
                    });
                }
            });
        });
    }

    /**
     * Adds a new chat to the database.
     *
     * @param {Object} connection - The database connection object.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {number} chatOwnerID - The ID of the chat owner.
     * @param {string} chatTitle - The title of the chat.
     *
     * @return {Promise<number>} Returns a promise that resolves with the ID of the newly inserted chat.
     * @throws {Error} If there is an error during the database query.
     */
    async addChat(connection: any, chatOwnerID: number, chatTitle: string): Promise<any[]> {
        return new Promise(async function (resolve, reject) {
            const colors = ["#512C2C", "#586E52", "#3C4E64"]; // Set of colors for chat img
            let bgColor = colors[Math.floor(Math.random() * colors.length)];

            const addChatSQL = "INSERT INTO Chats(chat_owner_id, title, bg_color) VALUES (?,?,?)";
            const addChatQuery = mysql.format(addChatSQL, [chatOwnerID, chatTitle, bgColor]);
            await connection.query(addChatQuery, async (err: Error, result: any) => {
                if (err) return reject(err);

                console.log("-- Added new chat --");
                return resolve([result.insertId, bgColor]);
            });
        });
    }

    async addConversation(
        connection: any,
        chatId: number,
        date: string,
        conversation: string,
        numMessages: number
    ): Promise<number> {
        /**
         * Note: This conversation should not already exist in the database. There are two cases:
         *
         *      1. This is the first time the conversation is being added. Therefore, it must
         *         not exist.
         *
         *      2. This conversation existed before, but on re-uploading this chat (and conversation)
         *         files, the old chat was deleted, and with that the conversations too.
         */

        return new Promise(async function (resolve, reject) {
            const addConversationSQL =
                "INSERT INTO Conversations(chat_id, conversation_date, messages, num_messages) VALUES (?,?,?,?)";
            const addConversationQuery = mysql.format(addConversationSQL, [
                chatId,
                date,
                conversation,
                numMessages,
            ]);
            await connection.query(addConversationQuery, async (err: Error, result: any) => {
                if (err) return reject(err);

                console.log("-- Conversation added --");
                return resolve(result.insertId);
            });
        });
    }

    async getAllUserChats(connection: any, res: any, userId: number) {
        const getChatsQuery = `SELECT C1.chat_id, title, sum(num_messages) AS num_messages, C1.bg_color
                                   FROM chats C1 JOIN conversations C2
                                   WHERE C1.chat_id = C2.chat_id AND
                                       C1.chat_owner_id = ?
                                   GROUP BY C1.chat_id`;
        const getChatsSQL = mysql.format(getChatsQuery, [userId]);
        await connection.query(getChatsSQL, async (err: Error, result: any) => {
            if (err) throw err;
            console.log(result);
            res.json(result);
        });
    }

    async getConversationOnDate(connection: any, res: any, date: string, chatId: number) {
        const getConversationQuery = `SELECT messages
                                      FROM conversations
                                      WHERE conversation_date = ? AND chat_id = ?`;
        const getConversationSQL = mysql.format(getConversationQuery, [date, chatId]);
        await connection.query(getConversationSQL, async (err: Error, result: any) => {
            if (err) throw err;
            // console.log("length: " + result.length);

            // console.log(result);

            // console.log(result[0].messages);
            if (result.length === 0) {
                console.log("-- No conversation found --");
                res.json({});
            } else {
                // assert(result.length === 1)
                console.log("-- Conversation found --");
                res.json(JSON.parse(result[0].messages));
            }
        });
    }
}
