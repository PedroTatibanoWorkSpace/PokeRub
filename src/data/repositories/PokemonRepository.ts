import { IPokemonRepository } from '../../domain/repositories/IPokemonRepository';
import { Pokemon, PokemonListResponse } from '../../domain/models/Pokemon';
import { pokeApiService } from '../datasources/PokeApiService';

export class PokemonRepository implements IPokemonRepository {
  async getPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
    return pokeApiService.getPokemonList(limit, offset);
  }

  async getPokemonById(id: number): Promise<Pokemon> {
    return pokeApiService.getPokemonById(id);
  }

  async getPokemonIdByName(name: string): Promise<number> {
    return pokeApiService.getPokemonIdByName(name);
  }

  async getPokemonByName(name: string): Promise<Pokemon> {
    return pokeApiService.getPokemonByName(name);
  }

  async searchPokemon(query: string): Promise<Pokemon[]> {
    return pokeApiService.searchPokemon(query);
  }

  async getPokemonSpecies(id: number): Promise<any> {
    return pokeApiService.getPokemonSpecies(id);
  }
}

export const pokemonRepository = new PokemonRepository();