import { IEvolutionRepository } from '../../domain/repositories/IEvolutionRepository';
import { EvolutionChain } from '../../domain/models/Evolution';
import { pokeApiService } from '../datasources/PokeApiService';
import axios from 'axios';

export class EvolutionRepository implements IEvolutionRepository {
  async getEvolutionChain(url: string): Promise<EvolutionChain> {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Falha ao tentar encontrar evolução: ${error}`);
    }
  }

  async getPokemonSpecies(pokemonId: number): Promise<any> {
    return pokeApiService.getPokemonSpecies(pokemonId);
  }
}

export const evolutionRepository = new EvolutionRepository();