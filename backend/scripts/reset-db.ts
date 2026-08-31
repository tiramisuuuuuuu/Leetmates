import { drizzle } from "drizzle-orm/node-postgres"; // or your preferred driver
import * as schema from "../src/db/schema";
import { reset } from "drizzle-seed";

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);

  await reset(db, schema); 
  console.log("Database rows wiped successfully!");
}

main();
