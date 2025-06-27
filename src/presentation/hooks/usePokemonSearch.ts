import { useQuery } from '@tanstack/react-query';
import { pokemonRepository } from '../../data/repositories/PokemonRepository';
import { QUERY_KEYS } from '../../core/config/queryClient';

export function usePokemonSearch(query: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.POKEMON_SEARCH, query],
    queryFn: async () => {
      if (query.length < 2) return [];
      
      try {
        const result = await pokemonRepository.searchPokemon(query);
        return Array.isArray(result) ? result : [result];
      } catch {
        return [];
      }
    },
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}