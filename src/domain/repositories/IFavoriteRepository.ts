import { Favorite } from '../models/Favorite';

export interface IFavoriteRepository {
  getFavorites(): Promise<Favorite[]>;
  addFavorite(pokemon: Favorite): Promise<void>;
  removeFavorite(pokemonId: number): Promise<void>;
  isFavorite(pokemonId: number): Promise<boolean>;
  clearFavorites(): Promise<void>;
}