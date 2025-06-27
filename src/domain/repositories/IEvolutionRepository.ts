import { EvolutionChain } from '../models/Evolution';

export interface IEvolutionRepository {
  getEvolutionChain(url: string): Promise<EvolutionChain>;
  getPokemonSpecies(pokemonId: number): Promise<any>;
}