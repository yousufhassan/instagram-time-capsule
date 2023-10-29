import { Pool, PoolClient } from "pg";
import { compare } from "bcryptjs";
import { log } from "console";
import {
    acquireClientFromPool,
    beginTransaction,
    commitTransaction,
    releasePoolClient,
    rollbackTransaction,
} from "../../cdk-common/layers/logic/nodejs/database.js";
import {
    getPasswordFromRequest,
    getUsernameFromRequest,
    logIncorrectPassword,
    logSuccessfulLogin,
    logUserDoesNotExist,
} from "./services.js";
import { User } from "../../cdk-common/layers/logic/nodejs/types.js";

export const login = async (pool: Pool, request: any): Promise<Object> => {
    const client = await acquireClientFromPool(pool);
    try {
        await beginTransaction(client);
        const username = getUsernameFromRequest(request);
        const password = getPasswordFromRequest(request);
        const user = await getUserFromUsername(client, username);
        if (user !== undefined) {
            await tryLogin(user, password);
        } else {
            logUserDoesNotExist();
            throw { message: "ERROR: User does not exist.", statusCode: 404 };
        }
        await commitTransaction(client);
        const hashedPassword = user.password;
        return { username: username, password: hashedPassword };
    } catch (error: any) {
        await rollbackTransaction(client);
        log(error);
        return error;
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

const tryLogin = async (user: User, password: string) => {
    const hashedPassword = user.password;
    if (await compare(password, hashedPassword)) {
        logSuccessfulLogin();
    } else {
        logIncorrectPassword();
        throw { message: "ERROR: Incorrect password.", statusCode: 401 };
    }
};
