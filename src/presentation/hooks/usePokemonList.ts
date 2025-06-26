import { useInfiniteQuery } from '@tanstack/react-query';
import { pokemonRepository } from '../../data/repositories/PokemonRepository';
import { QUERY_KEYS } from '../../core/config/queryClient';

export function usePokemonList() {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.POKEMON_LIST],
    queryFn: ({ pageParam = 0 }) => 
      pokemonRepository.getPokemonList(20, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.length * 20;
      return totalLoaded < lastPage.count ? totalLoaded : undefined;
    },
    initialPageParam: 0, 
    staleTime: 10 * 60 * 1000,
    enabled: true,
  });
}