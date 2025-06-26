import { IFavoriteRepository } from '../../domain/repositories/IFavoriteRepository';
import { Favorite, FavoriteStorage } from '../../domain/models/Favorite';
import { asyncStorageService } from '../datasources/AsyncStorageService';

const FAVORITES_KEY = '@PokeRub:favorites';

export class FavoriteRepository implements IFavoriteRepository {
  async getFavorites(): Promise<Favorite[]> {
    const storage = await asyncStorageService.getItem<FavoriteStorage>(FAVORITES_KEY);
    return storage?.favorites || [];
  }

  async addFavorite(pokemon: Favorite): Promise<void> {
    const favorites = await this.getFavorites();
    const newFavorites = [...favorites, pokemon];
    await asyncStorageService.setItem<FavoriteStorage>(FAVORITES_KEY, {
      favorites: newFavorites,
    });
  }

  async removeFavorite(pokemonId: number): Promise<void> {
    const favorites = await this.getFavorites();
    const newFavorites = favorites.filter(fav => fav.id !== pokemonId);
    await asyncStorageService.setItem<FavoriteStorage>(FAVORITES_KEY, {
      favorites: newFavorites,
    });
  }

  async isFavorite(pokemonId: number): Promise<boolean> {
    const favorites = await this.getFavorites();
    return favorites.some(fav => fav.id === pokemonId);
  }

  async clearFavorites(): Promise<void> {
    await asyncStorageService.setItem<FavoriteStorage>(FAVORITES_KEY, {
      favorites: [],
    });
  }
}

export const favoriteRepository = new FavoriteRepository();