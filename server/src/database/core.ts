import { PoolClient } from "pg";

export const getUserIdFromUsername = async (client: PoolClient, username: string): Promise<string> => {
    const getUserIdQuery = "SELECT user_id FROM Users WHERE username = $1";
    const queryResult = await client.query(getUserIdQuery, [username]);
    return queryResult.rows[0].user_id;
};
