import { useState, useMemo, useEffect } from 'react';
import { usePokemonSearch } from './usePokemonSearch';
import { PokemonListItem, Pokemon } from '../../domain/models/Pokemon';

export interface FilterOptions {
  types: string[];
}

export const EMPTY_FILTERS: FilterOptions = {
  types: [],
};

export function useSearchAndFilters(pokemonList: PokemonListItem[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>(EMPTY_FILTERS);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: searchResults,
    isLoading: isSearching,
    error: searchError,
  } = usePokemonSearch(debouncedSearchQuery);

  const displayedPokemon = useMemo(() => {
    let resultList: (PokemonListItem | Pokemon)[] = [];

    if (debouncedSearchQuery.length > 0) {
      if (searchResults && searchResults.length > 0) {
        resultList = searchResults;
      } else {
        resultList = pokemonList.filter(pokemon =>
          pokemon.name
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()),
        );
      }
    } else {
      resultList = pokemonList;
    }

    return resultList;
  }, [pokemonList, searchResults, debouncedSearchQuery]);

  const hasActiveFilters = filters.types.length > 0;

  const clearFilters = () => setFilters(EMPTY_FILTERS);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    displayedPokemon,
    hasActiveFilters,
    clearFilters,
    isSearching,
    searchError,
    debouncedSearchQuery,
  };
}

export function getActiveFiltersCount(filters: FilterOptions): number {
  return filters.types.length;
}