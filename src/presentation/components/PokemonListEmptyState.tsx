import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';

interface PokemonListEmptyStateProps {
  isSearching: boolean;
  searchQuery: string;
  searchError: any;
  hasActiveFilters: boolean;
}

export function PokemonListEmptyState({
  isSearching,
  searchQuery,
  searchError,
  hasActiveFilters,
}: PokemonListEmptyStateProps) {
  if (isSearching) {
    return <LoadingSpinner message="Buscando pokémons..." />;
  }

  if (searchQuery.length > 0) {
    if (searchError) {
      return (
        <EmptyState
          title="Pokémon não encontrado"
          message={`"${searchQuery}" não foi encontrado. Verifique a ortografia.`}
          emoji="❌"
        />
      );
    }
    
    return (
      <EmptyState
        title="Nenhum resultado"
        message={`Não encontramos pokémons com "${searchQuery}"`}
        emoji="🔍"
      />
    );
  }

  if (hasActiveFilters) {
    return (
      <EmptyState
        title="Nenhum pokémon nos filtros"
        message="Tente ajustar os filtros para ver mais resultados"
        emoji="🎯"
      />
    );
  }

  return (
    <EmptyState
      title="Erro ao carregar"
      message="Não foi possível carregar os pokémons"
      emoji="⚠️"
    />
  );
}