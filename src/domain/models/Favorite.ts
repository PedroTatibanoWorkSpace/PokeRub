export interface Favorite {
  id: number;
  name: string;
  imageUrl: string;
  types: string[];
  addedAt: string;
}

export interface FavoriteStorage {
  favorites: Favorite[];
}