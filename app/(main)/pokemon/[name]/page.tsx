"use client";

import React from "react";
import { PokemonDetails as PokemonDetailsComponent } from "@/components/pokemon/pokemon-details";

interface PokemonDetailPageProps {
  params: { name: string };
}

export default function PokemonDetailPage({ params }: PokemonDetailPageProps) {
  const { name } = params;

  return <PokemonDetailsComponent name={name} />;
}
