import { Request } from "express";
import { Pool, PoolClient } from "pg";
import { log } from "console";
import {
    getHashedPasswordFromRequest,
    getUsernameFromRequest,
    logUserAlreadyExists,
    logUserCreated,
} from "../src/services";
import {
    acquireClientFromPool,
    beginTransaction,
    commitTransaction,
    releasePoolClient,
    rollbackTransaction,
} from "../../common/database";

export const createUser = async (pool: Pool, request: Request): Promise<Object> => {
    const client = await acquireClientFromPool(pool);
    try {
        await beginTransaction(client);
        const username = getUsernameFromRequest(request);
        const hashedPassword = await getHashedPasswordFromRequest(request);
        const userExists = await userExistsInDB(client, username);
        if (userExists) {
            logUserAlreadyExists();
            return { statusCode: 409 };
            // response.sendStatus(409);
        } else {
            await insertUserIntoDB(client, username, hashedPassword);
            logUserCreated();
            // response.json({ username: username, password: hashedPassword });
        }
        await commitTransaction(client);
        return { username: username, password: hashedPassword };
    } catch (error: unknown) {
        await rollbackTransaction(client);
        log(error);
        throw error;
    } finally {
        releasePoolClient(client);
    }
};

const insertUserIntoDB = async (client: PoolClient, username: string, hashedPassword: string): Promise<void> => {
    const insertUserQuery = "INSERT INTO Users(username, password) VALUES ($1, $2)";
    await client.query(insertUserQuery, [username, hashedPassword]);
};

const userExistsInDB = async (client: PoolClient, username: string): Promise<boolean> => {
    const searchUserQuery = "SELECT * FROM Users WHERE username = $1";
    const queryResult = await client.query(searchUserQuery, [username]);
    return queryResult.rowCount === 1;
};
