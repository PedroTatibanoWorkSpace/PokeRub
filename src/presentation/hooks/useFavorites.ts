import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { favoriteRepository } from '../../data/repositories/FavoriteRepository';
import { QUERY_KEYS } from '../../core/config/queryClient';
import { Favorite } from '../../domain/models/Favorite';
import { Pokemon } from '../../domain/models/Pokemon';

export function useFavorites() {
  return useQuery({
    queryKey: [QUERY_KEYS.FAVORITES],
    queryFn: () => favoriteRepository.getFavorites(),
    staleTime: 0,
  });
}

export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pokemon: Pokemon) => {
      const favorite: Favorite = {
        id: pokemon.id,
        name: pokemon.name,
        imageUrl: pokemon.sprites.other['official-artwork'].front_default || 
                  pokemon.sprites.front_default || '',
        types: pokemon.types.map(t => t.type.name),
        addedAt: new Date().toISOString(),
      };
      return favoriteRepository.addFavorite(favorite);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FAVORITES] });
    },
  });
}

export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pokemonId: number) => favoriteRepository.removeFavorite(pokemonId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FAVORITES] });
    },
  });
}

export function useClearAllFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => favoriteRepository.clearFavorites(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FAVORITES] });
    },
  });
}

export function useIsFavorite(pokemonId: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.FAVORITES, 'check', pokemonId],
    queryFn: () => favoriteRepository.isFavorite(pokemonId),
    enabled: !!pokemonId,
  });
}