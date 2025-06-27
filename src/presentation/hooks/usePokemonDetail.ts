import { useQuery } from '@tanstack/react-query';
import { pokemonRepository } from '../../data/repositories/PokemonRepository';
import { QUERY_KEYS } from '../../core/config/queryClient';

export function usePokemonDetail(pokemonId: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.POKEMON_DETAIL, pokemonId],
    queryFn: () => pokemonRepository.getPokemonById(pokemonId),
    enabled: !!pokemonId,
    staleTime: 15 * 60 * 1000, 
  });
}