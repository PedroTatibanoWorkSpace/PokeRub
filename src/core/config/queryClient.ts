import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export const QUERY_KEYS = {
  POKEMON_LIST: 'pokemon-list',
  POKEMON_DETAIL: 'pokemon-detail',
  POKEMON_SPECIES: 'pokemon-species',
  POKEMON_SEARCH: 'pokemon-search',
  EVOLUTION_CHAIN: 'evolution-chain',
  FAVORITES: 'favorites',
} as const;