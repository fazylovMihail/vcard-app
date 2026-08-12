import type { Knex } from "knex";
import { resolve } from "node:path";

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
