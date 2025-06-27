import { Pokemon, PokemonListResponse } from '../models/Pokemon';

export interface IPokemonRepository {
  getPokemonList(limit?: number, offset?: number): Promise<PokemonListResponse>;
  getPokemonById(id: number): Promise<Pokemon>;
  getPokemonByName(name: string): Promise<Pokemon>;
  getPokemonIdByName(name: string): Promise<number>;
  searchPokemon(query: string): Promise<Pokemon[]>;
  getPokemonSpecies(id: number): Promise<any>;
}