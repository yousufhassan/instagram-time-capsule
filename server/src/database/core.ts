// import { Request, Response } from "express";
import { Pool } from "pg";

export const getUserIdFromUsername = async (pool: Pool, username: string) => {
    const getUserIdQuery = "SELECT user_id FROM Users WHERE username = $1";
    const queryResult = await pool.query(getUserIdQuery, [username]);
    const user_id: string = queryResult.rows[0].user_id;
    return user_id;
};
