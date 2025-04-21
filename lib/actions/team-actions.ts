// "use server";

// import { revalidatePath } from "next/cache";

// import { and, eq, gt, sql } from "drizzle-orm";
// import { z } from "zod";

// import { auth } from "@/auth";
// import { db } from "@/db/drizzle";
// import { Team } from "@/types";

// const TeamSchema = z.object({
//   name: z.string().min(1).max(100),
// });

// const PokemonSchema = z.object({
//   pokemonId: z.string().min(1).max(100),
//   name: z.string().min(1).max(100),
//   slot: z.number().int().min(0).max(5),
// });

// export async function fetchTeamsAction(userId: string): Promise<Team[]> {
//   const session = await auth();
//   if (!session?.user?.id || session.user.id !== userId) {
//     throw new Error("Unauthorized");
//   }

//   try {
//     const teamData = await db
//       .select({
//         id: teamsTable.id,
//         name: teamsTable.name,
//       })
//       .from(teamsTable)
//       .where(eq(teamsTable.userId, userId));

//     const teams = await Promise.all(
//       teamData.map(async (team) => {
//         const members = await db
//           .select({
//             id: teamMembersTable.pokemonId,
//             name: teamMembersTable.pokemonId, // In a real app, join with a Pokemon table for name
//             slot: teamMembersTable.slot,
//           })
//           .from(teamMembersTable)
//           .where(eq(teamMembersTable.teamId, team.id))
//           .orderBy(teamMembersTable.slot);

//         return {
//           id: team.id,
//           name: team.name,
//           members: members.map((m) => ({ id: m.id, name: m.name })),
//         };
//       })
//     );

//     return teams;
//   } catch (error) {
//     console.error("Failed to fetch teams:", error);
//     throw new Error("Unable to load teams");
//   }
// }

// export async function addTeamAction(name: string) {
//   const session = await auth();
//   if (!session?.user?.id) throw new Error("Unauthorized");

//   const parsed = TeamSchema.parse({ name });
//   const teamId =
//     Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

//   try {
//     const existingTeams = await db
//       .select()
//       .from(teamsTable)
//       .where(eq(teamsTable.userId, session.user.id));
//     if (existingTeams.length >= MAX_TEAMS) {
//       throw new Error("Maximum teams reached");
//     }

//     await db.insert(teamsTable).values({
//       id: teamId,
//       userId: session.user.id,
//       name: parsed.name,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });

//     revalidatePath("/teams");
//     return { id: teamId, name: parsed.name, members: [] };
//   } catch (error) {
//     console.error("Failed to add team:", error);
//     throw new Error("Unable to create team");
//   }
// }

// export async function updateTeamNameAction(teamId: string, name: string) {
//   const session = await auth();
//   if (!session?.user?.id) throw new Error("Unauthorized");

//   const parsed = TeamSchema.parse({ name });

//   try {
//     await db
//       .update(teamsTable)
//       .set({ name: parsed.name, updatedAt: new Date() })
//       .where(
//         and(eq(teamsTable.id, teamId), eq(teamsTable.userId, session.user.id))
//       );

//     revalidatePath("/teams");
//   } catch (error) {
//     console.error("Failed to update team:", error);
//     throw new Error("Unable to update team");
//   }
// }

// export async function deleteTeamAction(teamId: string) {
//   const session = await auth();
//   if (!session?.user?.id) throw new Error("Unauthorized");

//   try {
//     await db
//       .delete(teamsTable)
//       .where(
//         and(eq(teamsTable.id, teamId), eq(teamsTable.userId, session.user.id))
//       );

//     revalidatePath("/teams");
//   } catch (error) {
//     console.error("Failed to delete team:", error);
//     throw new Error("Unable to delete team");
//   }
// }

// export async function addPokemonToTeamAction(
//   teamId: string,
//   pokemonId: string,
//   name: string,
//   slot: number
// ) {
//   const session = await auth();
//   if (!session?.user?.id) throw new Error("Unauthorized");

//   const parsed = PokemonSchema.parse({ pokemonId, name, slot });

//   try {
//     const team = await db
//       .select()
//       .from(teamsTable)
//       .where(
//         and(eq(teamsTable.id, teamId), eq(teamsTable.userId, session.user.id))
//       )
//       .limit(1);

//     if (!team[0]) throw new Error("Team not found");

//     const existingMembers = await db
//       .select()
//       .from(teamMembersTable)
//       .where(eq(teamMembersTable.teamId, teamId));

//     if (existingMembers.length >= MAX_TEAM_MEMBERS) {
//       throw new Error("Team is full");
//     }
//     if (existingMembers.some((m) => m.pokemonId === pokemonId)) {
//       throw new Error("Pokemon already in team");
//     }

//     // Shift slots to make room
//     await db
//       .update(teamMembersTable)
//       .set({ slot: sql`${teamMembersTable.slot} + 1` })
//       .where(
//         and(
//           eq(teamMembersTable.teamId, teamId),
//           gt(teamMembersTable.slot, parsed.slot)
//         )
//       );

//     await db.insert(teamMembersTable).values({
//       id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
//       teamId,
//       pokemonId: parsed.pokemonId,
//       slot: parsed.slot,
//     });

//     revalidatePath("/teams");
//   } catch (error) {
//     console.error("Failed to add Pokemon:", error);
//     throw error;
//   }
// }

// export async function removePokemonFromTeamAction(
//   teamId: string,
//   pokemonId: string
// ) {
//   const session = await auth();
//   if (!session?.user?.id) throw new Error("Unauthorized");

//   try {
//     const [pokemonToRemove] = await db
//       .select({ slot: teamMembersTable.slot })
//       .from(teamMembersTable)
//       .where(
//         and(
//           eq(teamMembersTable.teamId, teamId),
//           eq(teamMembersTable.pokemonId, pokemonId)
//         )
//       );

//     if (!pokemonToRemove) throw new Error("Pokemon not found in team");

//     await db
//       .delete(teamMembersTable)
//       .where(
//         and(
//           eq(teamMembersTable.teamId, teamId),
//           eq(teamMembersTable.pokemonId, pokemonId)
//         )
//       );

//     await db
//       .update(teamMembersTable)
//       .set({ slot: sql`${teamMembersTable.slot} - 1` })
//       .where(
//         and(
//           eq(teamMembersTable.teamId, teamId),
//           gt(teamMembersTable.slot, pokemonToRemove.slot)
//         )
//       );

//     revalidatePath("/teams");
//   } catch (error) {
//     console.error("Failed to remove Pokemon:", error);
//     throw new Error("Unable to remove Pokemon");
//   }
// }

// export async function movePokemonAction(
//   fromTeamId: string,
//   toTeamId: string,
//   pokemonId: string,
//   position?: number
// ) {
//   const session = await auth();
//   if (!session?.user?.id) throw new Error("Unauthorized");

//   try {
//     const [fromTeam] = await db
//       .select()
//       .from(teamsTable)
//       .where(
//         and(
//           eq(teamsTable.id, fromTeamId),
//           eq(teamsTable.userId, session.user.id)
//         )
//       );

//     const [toTeam] = await db
//       .select()
//       .from(teamsTable)
//       .where(
//         and(eq(teamsTable.id, toTeamId), eq(teamsTable.userId, session.user.id))
//       );

//     if (!fromTeam || !toTeam) throw new Error("Team not found");

//     const toTeamMembers = await db
//       .select()
//       .from(teamMembersTable)
//       .where(eq(teamMembersTable.teamId, toTeamId));

//     if (toTeamMembers.length >= MAX_TEAM_MEMBERS) {
//       throw new Error("Target team is full");
//     }
//     if (toTeamMembers.some((m) => m.pokemonId === pokemonId)) {
//       throw new Error("Pokemon already in target team");
//     }

//     const [pokemon] = await db
//       .select({ slot: teamMembersTable.slot })
//       .from(teamMembersTable)
//       .where(
//         and(
//           eq(teamMembersTable.teamId, fromTeamId),
//           eq(teamMembersTable.pokemonId, pokemonId)
//         )
//       );

//     if (!pokemon) throw new Error("Pokemon not found");

//     // Remove from source team
//     await db
//       .delete(teamMembersTable)
//       .where(
//         and(
//           eq(teamMembersTable.teamId, fromTeamId),
//           eq(teamMembersTable.pokemonId, pokemonId)
//         )
//       );

//     await db
//       .update(teamMembersTable)
//       .set({ slot: sql`${teamMembersTable.slot} - 1` })
//       .where(
//         and(
//           eq(teamMembersTable.teamId, fromTeamId),
//           gt(teamMembersTable.slot, pokemon.slot)
//         )
//       );

//     // Add to target team
//     const targetSlot = position ?? toTeamMembers.length;
//     await db
//       .update(teamMembersTable)
//       .set({ slot: sql`${teamMembersTable.slot} + 1` })
//       .where(
//         and(
//           eq(teamMembersTable.teamId, toTeamId),
//           gt(teamMembersTable.slot, targetSlot)
//         )
//       );

//     await db.insert(teamMembersTable).values({
//       id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
//       teamId: toTeamId,
//       pokemonId,
//       slot: targetSlot,
//     });

//     revalidatePath("/teams");
//   } catch (error) {
//     console.error("Failed to move Pokemon:", error);
//     throw new Error("Unable to move Pokemon");
//   }
// }

// export async function clearAllTeamsAction() {
//   const session = await auth();
//   if (!session?.user?.id) throw new Error("Unauthorized");

//   try {
//     await db.delete(teamsTable).where(eq(teamsTable.userId, session.user.id));
//     revalidatePath("/teams");
//   } catch (error) {
//     console.error("Failed to clear teams:", error);
//     throw new Error("Unable to clear teams");
//   }
// }
