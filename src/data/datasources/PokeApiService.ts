import axios from 'axios';
import { Pokemon, PokemonListResponse } from '../../domain/models/Pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class PokeApiService {
  async getPokemonList(limit = 20, offset = 0): Promise<PokemonListResponse> {
    try {
      const response = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
      
      const results = response.data.results.map((pokemon: any) => ({
        ...pokemon,
        id: this.extractIdFromUrl(pokemon.url),
      }));

      return {
        ...response.data,
        results,
      };
    } catch (error) { 
      throw new Error(`Falha ao tentar encontrar lista de pokemon: ${error}`);
    }
  }

  async getPokemonById(id: number): Promise<Pokemon> {
    try {
      const response = await api.get(`/pokemon/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Falha ao tentar encontrar pokemon ${id}: ${error}`);
    }
  }

  async getPokemonByName(name: string): Promise<Pokemon> {
    try {
      const response = await api.get(`/pokemon/${name.toLowerCase()}`);
      return response.data;
    } catch (error) {
      throw new Error(`Falha ao tentar encontrar pokemon ${name}: ${error}`);
    }
  }

  async getPokemonIdByName(name: string): Promise<number> {
    try {
      const response = await api.get(`/pokemon/${name.toLowerCase()}`);
      return response.data.id;
    } catch (error) {
      throw new Error(`Falha ao tentar encontrar ID do pokemon ${name}: ${error}`);
    }
  }

  async searchPokemon(query: string): Promise<Pokemon[]> {
    try {
      const pokemon = await this.getPokemonByName(query);
      return [pokemon];
    } catch {
      if (!isNaN(Number(query))) {
        try {
          const pokemon = await this.getPokemonById(Number(query));
          return [pokemon];
        } catch {
          return [];
        }
      }
      return [];
    }
  }

  async getPokemonSpecies(id: number) {
    try {
      const response = await api.get(`/pokemon-species/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Falha ao tentar encontrar pokemon species ${id}: ${error}`);
    }
  }

  private extractIdFromUrl(url: string): number {
    const matches = url.match(/\/(\d+)\/$/);
    return matches ? parseInt(matches[1], 10) : 0;
  }
}

export const pokeApiService = new PokeApiService();