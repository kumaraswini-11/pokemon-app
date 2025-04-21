import {PokemonDetails as PokemonDetailsComponent} from "@/components/pokemon/pokemon-details";
import {POKEMON_BASE_URL} from "@/constants";

// Dynamic metadata for SEO
export async function generateMetadata({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;

  try {
    const response = await fetch(`${POKEMON_BASE_URL}/pokemon/${id}`, {
      cache: "force-cache",
    });
    if (!response.ok) throw new Error("Pokemon not found");
    const pokemon = await response.json();

    return {
      title: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} | Pokedex`,
      description: `Learn about ${pokemon.name}, a Pokemon with types ${pokemon.types
        .map((t: {type: {name: string}}) => t.type.name)
        .join(", ")}.`,
      openGraph: {
        title: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} | Pokedex`,
        description: `View detailed information about ${pokemon.name}, including stats, abilities, and evolution chain.`,
        images: [`${process.env.POKEMON_IMAGE_BASE_URL}/${pokemon.id}.png`],
      },
    };
  } catch {
    return {
      title: "Pokemon Not Found | Pokedex",
      description: "This Pokemon could not be found in the Pokedex.",
    };
  }
}

export default async function PokemonPage({params}: {params: Promise<{id: string}>}) {
  const {id} = await params;

  return <PokemonDetailsComponent id={id} />;
}
