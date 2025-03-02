import { MetadataRoute } from "next";

import { api } from "@/lib/utils";

// Fetch all Pokemon names for dynamic routes
async function fetchAllPokemonNames(): Promise<string[]> {
  const { data } = await api.get("/pokemon");
  return data.results.map((pokemon: { name: string }) => pokemon.name);
}
const pokemonNames = await fetchAllPokemonNames();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NODE_ENV !== "development"
      ? process.env.NEXT_PUBLIC_APP_URL
      : "http://localhost:3000";
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
  const pokemonRoutes: MetadataRoute.Sitemap = pokemonNames.map((name) => ({
    url: `${baseUrl}/pokemon/${name}`,
    lastModified: currentDate,
    changeFrequency: "monthly", // Pokemon data rarely changes
    priority: 0.8,
  }));

  return [...staticRoutes, ...pokemonRoutes];
}
