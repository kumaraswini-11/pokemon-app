import {PokemonDetails as PokemonDetailsComponent} from "@/components/pokemon/pokemon-details";
import {POKEMON_BASE_URL} from "@/constants";

// Dynamic metadata for SEO
export async function generateMetadata({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;

  try {
    const response = await fetch(`${POKEMON_BASE_URL}/pokemon/${id}`, {
      cache: "force-cache",
    });
    if (!response.ok) throw new Error("Pokémon not found");
    const pokemon = await response.json();

    return {
      title: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} | Pokédex`,
      description: `Learn about ${pokemon.name}, a Pokémon with types ${pokemon.types
        .map((t: {type: {name: string}}) => t.type.name)
        .join(", ")}.`,
      openGraph: {
        title: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} | Pokédex`,
        description: `View detailed information about ${pokemon.name}, including stats, abilities, and evolution chain.`,
        images: [`${process.env.POKEMON_IMAGE_BASE_URL}/${pokemon.id}.png`],
      },
    };
  } catch {
    return {
      title: "Pokémon Not Found | Pokédex",
      description: "This Pokémon could not be found in the Pokédex.",
    };
  }
}

export default async function PokemonPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;

  return <PokemonDetailsComponent id={id} />;
}
