import {
    getHashedPasswordFromRequest,
    getUsernameFromRequest,
    logUserAlreadyExists,
    logUserCreated,
} from "../../services/auth.js";
import { Request, Response } from "express";
import { log } from "console";
import {
    acquireClientFromPool,
    beginTransaction,
    commitTransaction,
    releasePoolClient,
    rollbackTransaction,
} from "../database.js";
import { Pool, PoolClient } from "pg";

export const createUser = async (pool: Pool, request: Request, response: Response) => {
    const client = await acquireClientFromPool(pool);
    try {
        await beginTransaction(client);
        const username = getUsernameFromRequest(request);
        const hashedPassword = await getHashedPasswordFromRequest(request);
        const userExists = await userExistsInDB(client, username);
        if (userExists) {
            logUserAlreadyExists();
            response.sendStatus(409);
        } else {
            await insertUserIntoDB(client, username, hashedPassword);
            logUserCreated();
            response.json({ username: username, password: hashedPassword });
        }
        await commitTransaction(client);
    } catch (error: unknown) {
        await rollbackTransaction(client);
        log(error);
    } finally {
        releasePoolClient(client);
    }
};

const insertUserIntoDB = async (client: PoolClient, username: string, hashedPassword: string) => {
    try {
        const insertUserQuery = "INSERT INTO Users(username, password) VALUES ($1, $2)";
        await client.query(insertUserQuery, [username, hashedPassword]);
    } catch (error: unknown) {
        log(error);
    }
};

const userExistsInDB = async (client: PoolClient, username: string) => {
    const searchUserQuery = "SELECT * FROM Users WHERE username = $1";
    const queryResult = await client.query(searchUserQuery, [username]);
    return queryResult.rowCount === 1;
};