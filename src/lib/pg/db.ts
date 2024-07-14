import { env } from "@/env";
import { Pool, PoolClient } from "pg";

const CONFIG = {
  host: env.POSTGRES_HOST,
  port: env.POSTGRES_PORT,
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
  database: env.POSTGRES_DB,
  ssl: true,
};

class Database {
  private pool: Pool;
  private client: PoolClient | undefined;

  constructor() {
    this.pool = new Pool(CONFIG);
    this.connect();
  }

  private async connect() {
    try {
      this.client = await this.pool.connect();
    } catch (error) {
      console.error(`Error starting databa with pg, ${error}`);
      // throw new Error(`Error starting databa with pg, ${error}`);
    }
  }

  get clientInstance() {
    return this.client;
  }
}

export const database = new Database();
