import { Request, Response } from "express";
import { Pool, PoolClient } from "pg";
import { getUserIdFromUsername } from "../core.js";
import { getUsernameFromRequest } from "../../services/auth.js";
import {
    acquireClientFromPool,
    beginTransaction,
    commitTransaction,
    releasePoolClient,
    rollbackTransaction,
} from "../database.js";
import { log } from "console";

export const getChatList = async (pool: Pool, request: Request, response: Response) => {
    const client = await acquireClientFromPool(pool);
    try {
        await beginTransaction(client);
        const username = getUsernameFromRequest(request);
        const userId = await getUserIdFromUsername(pool, username);
        const chatList = await getChatListFromUserId(client, userId);
        response.json(chatList);
        await commitTransaction(client);
    } catch (error: unknown) {
        await rollbackTransaction(client);
        log(error);
    } finally {
        releasePoolClient(client);
    }
};

export const getChatListFromUserId = async (client: PoolClient, userId: string) => {
    const getChatsFromUserIdQuery = `SELECT C1.chat_id, title, sum(num_messages) AS num_messages, C1.bg_color
                                     FROM chats C1, conversations C2
                                     WHERE C1.chat_id = C2.chat_id AND
                                         C1.chat_owner_id = $1
                                     GROUP BY C1.chat_id`;
    const queryResult = await client.query(getChatsFromUserIdQuery, [userId]);
    const chatList = queryResult.rows;
    return chatList;
};

// let username = req.body.username; // Username of the logged in user
// db.con.getConnection(async function (connection: any) {
//     db.getUserIdFromUsername(connection, username)
//         .then(function (userId) {
//             return userId;
//         })
//         .then(async function (userId) {
//             // console.log("woohoo");
//             // res.send("woohoo");
//             db.getAllUserChats(connection, res, userId);
//         });
//     connection.release();
// });
