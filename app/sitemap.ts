import {MetadataRoute} from "next";

import {api} from "@/lib/utils";

// Fetch all Pokemon names for dynamic routes
async function fetchAllPokemonNames(): Promise<string[]> {
  // This could potentially return a lot of Pokemon (800+), which might cause your sitemap to be very large, that's why limit.
  const {data} = await api.get("/pokemon?limit=90");
  return data?.results?.map((pokemon: {name: string}) => pokemon.name) ?? [];
}
const pokemonNames = await fetchAllPokemonNames();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const currentDate = new Date().toISOString();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl as string,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // Dynamic Pokemon routes
  const pokemonRoutes: MetadataRoute.Sitemap = pokemonNames.map(name => ({
    url: `${baseUrl}/pokemon/${name}`,
    lastModified: currentDate,
    changeFrequency: "monthly", // Pokemon data rarely changes
    priority: 0.8,
  }));

  return [...staticRoutes, ...pokemonRoutes];
}
