import type { Knex } from "knex";
import * as dotenv from "dotenv";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const rootEnv = resolve(__dirname, "../.env");
dotenv.config({ path: rootEnv });

const config: Knex.Config = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  migrations: {
    directory: resolve(__dirname, "./src/shared/database/migrations"),
    extension: "ts",
  },
  seeds: {
    directory: resolve(__dirname, "./src/shared/database/seeds"),
  },
};

export default config;
