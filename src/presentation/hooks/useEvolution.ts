import { useQuery } from '@tanstack/react-query';
import { evolutionRepository } from '../../data/repositories/EvolutionRepository';
import { pokemonRepository } from '../../data/repositories/PokemonRepository';
import { QUERY_KEYS } from '../../core/config/queryClient';

export function useEvolutionChain(pokemonId: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.EVOLUTION_CHAIN, pokemonId],
    queryFn: async () => {
      const species = await evolutionRepository.getPokemonSpecies(pokemonId);
      const evolutionChain = await evolutionRepository.getEvolutionChain(species.evolution_chain.url);
      return evolutionChain;
    },
    enabled: !!pokemonId,
    staleTime: 15 * 60 * 1000,
  });
}

export function usePokemonForEvolution(pokemonName: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.POKEMON_DETAIL, 'evolution', pokemonName],
    queryFn: () => pokemonRepository.getPokemonByName(pokemonName),
    enabled: !!pokemonName,
    staleTime: 15 * 60 * 1000,
  });
}