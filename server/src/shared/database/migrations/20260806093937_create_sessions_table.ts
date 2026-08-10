import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("sessions", (table) => {
    table.string("session_id", 21).notNullable().primary();
    table.string("user_id", 21).notNullable();
    table.timestamp("expired_at").defaultTo(knex.raw("NOW() + INTERVAL '3 days'"));
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("sessions");
}
