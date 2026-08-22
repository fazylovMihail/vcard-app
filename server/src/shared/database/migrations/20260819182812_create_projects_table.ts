import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("projects", (table) => {
    table.string("id", 21).notNullable().primary();
    table.string("title", 255).notNullable();
    table.string("content", 10000);
    table.timestamp("real_created_at");
    table.string("gh_url", 2048).notNullable();
    table.string("deploy_url");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("projects");
}
