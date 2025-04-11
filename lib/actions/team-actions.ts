// "use server";

// import {eq} from "drizzle-orm";

// import {auth} from "@/auth";
// import {db} from "@/db/drizzle";

// export async function saveTeamToProfile() {
//   const session = await auth();
//   if (!session?.user?.id) throw new Error("Unauthorized");

//   // Retrive the teams detail from zustand store and insert tin to the db
//   await db.insert(teamsTable).values({
//     userId: session.user.id,
//     name: team.name,
//     members: JSON.stringify(team.members),
//   });
// }

// export async function getUserTeams() {
//   const session = await auth();
//   if (!session?.user?.id) return [];

//   const teams = await db.select().from(teamsTable).where(eq(teamsTable.userId, session.user.id));
//   return teams;
// }
