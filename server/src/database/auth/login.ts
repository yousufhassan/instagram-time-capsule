import { Request, Response } from "express";
import { Pool, PoolClient } from "pg";
import {
    acquireClientFromPool,
    beginTransaction,
    commitTransaction,
    releasePoolClient,
    rollbackTransaction,
} from "../database.js";
import { log } from "console";
import {
    getPasswordFromRequest,
    getUsernameFromRequest,
    logIncorrectPassword,
    logSuccessfulLogin,
    logUserDoesNotExist,
} from "../../services/auth.js";
import { compare } from "bcrypt";
import { User } from "../../types.js";

export const login = async (pool: Pool, request: Request, response: Response) => {
    const client = await acquireClientFromPool(pool);
    try {
        await beginTransaction(client);
        const username = getUsernameFromRequest(request);
        const password = getPasswordFromRequest(request);
        const user = await getUserFromUsername(client, username);
        if (user !== undefined) {
            log(user);
            log(username);
            log(password);
            await tryLogin(user, username, password, response);
        } else {
            userDoesNotExist(response);
        }
        await commitTransaction(client);
    } catch (error: unknown) {
        await rollbackTransaction(client);
        log(error);
    } finally {
        releasePoolClient(client);
    }
};

export const getUserFromUsername = async (client: PoolClient, username: string) => {
    const searchUserQuery = "SELECT * FROM Users WHERE username = $1";
    const queryResult = await client.query(searchUserQuery, [username]);
    if (queryResult.rowCount === 1) {
        const user: User = queryResult.rows[0];
        return user;
    } else {
        return undefined;
    }
};

const tryLogin = async (user: User, username: string, password: string, response: Response) => {
    const hashedPassword = user.hashedPassword;
    if (await compare(password, hashedPassword)) {
        logSuccessfulLogin();
        response.json({ username: username, password: hashedPassword });
    } else {
        logIncorrectPassword();
        response.send("Password incorrect!");
    }
};

const userDoesNotExist = (response: Response) => {
    logUserDoesNotExist();
    response.sendStatus(404);
};
