import { useMutation } from '@tanstack/react-query';
import { pokemonRepository } from '../../data/repositories/PokemonRepository';

export function usePokemonIdByName() {
  return useMutation({
    mutationFn: (pokemonName: string) => pokemonRepository.getPokemonIdByName(pokemonName),
    onError: (error) => {
      console.error('Erro ao buscar ID do pokémon:', error);
    },
  });
}

export function usePokemonByName() {
  return useMutation({
    mutationFn: (pokemonName: string) => pokemonRepository.getPokemonByName(pokemonName),
    onError: (error) => {
      console.error('Erro ao buscar pokémon:', error);
    },
  });
}