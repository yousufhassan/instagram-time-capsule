import { config } from "dotenv";
import pg, { Pool, PoolClient } from "pg";
config();

export const createPool = () => {
    return new pg.Pool({ connectionString: process.env.DATABASE_URL });
};

export const acquireClientFromPool = (pool: Pool) => {
    return pool.connect();
};

export const releasePoolClient = (client: PoolClient) => {
    return client.release();
};

export const beginTransaction = (client: PoolClient) => {
    return client.query("BEGIN");
};

export const commitTransaction = (client: PoolClient) => {
    return client.query("COMMIT");
};

export const rollbackTransaction = (client: PoolClient) => {
    return client.query("ROLLBACK");
};
