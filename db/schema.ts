import {relations, sql} from "drizzle-orm";
import {
  AnyPgColumn,
  boolean,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";
import {z} from "zod";

export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", {length: 100}).notNull(),
    email: varchar("email", {length: 254}).notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    passwordHash: varchar("password_hash", {length: 255}).notNull(),
    provider: varchar("provider", {length: 50}),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  table => [uniqueIndex("email_unique_idx").on(lower(table.email))]
);

// Helper function to generate a SQL expression for lowercasing a column (Used for case-insensitive unique indexes)
export function lower(column: AnyPgColumn) {
  return sql`lower(${column})`;
}

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(usersTable);
export const selectUserSchema = createSelectSchema(usersTable);

// TypeScript types
export type User = z.infer<typeof selectUserSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;

/******************************************************************************************/

export const teamsTable = pgTable(
  "teams",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, {onDelete: "cascade"}),
    name: varchar("name", {length: 100}).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  table => [uniqueIndex("user_team_name_unique").on(table.userId, table.name)]
);

export const teamMembersTable = pgTable(
  "team_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    teamId: uuid("team_id")
      .notNull()
      .references(() => teamsTable.id, {onDelete: "cascade"}),
    pokemonId: varchar("pokemon_id", {length: 100}).notNull(),
  },
  table => [uniqueIndex("team_pokemon_unique").on(table.teamId, table.pokemonId)]
);

// Relations for easier querying
export const teamsRelations = relations(teamsTable, ({many}) => ({
  members: many(teamMembersTable),
}));

export const teamMembersRelations = relations(teamMembersTable, ({one}) => ({
  team: one(teamsTable, {
    fields: [teamMembersTable.teamId],
    references: [teamsTable.id],
  }),
}));

export const usersRelations = relations(usersTable, ({many}) => ({
  teams: many(teamsTable),
}));
