import {migrate} from "drizzle-orm/neon-http/migrator";

import {db} from "./drizzle";

async function main() {
  await migrate(db, {migrationsFolder: "drizzle"});
  console.log("Migration completed.");
}

main().catch(error => {
  console.error("Migration failed !!", error);
  process.exit(1);
});
