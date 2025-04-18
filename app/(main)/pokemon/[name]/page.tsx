import {PokemonDetails as PokemonDetailsComponent} from "@/components/pokemon/pokemon-details";

interface PokemonDetailPageProps {
  params: {name: string};
}

export default async function PokemonDetailPage({params}: PokemonDetailPageProps) {
  const {name} = await params;

  return <PokemonDetailsComponent name={name} />;
}
