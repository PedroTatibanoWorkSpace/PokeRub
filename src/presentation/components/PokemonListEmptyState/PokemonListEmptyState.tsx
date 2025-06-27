import React from 'react';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { EmptyState } from '../EmptyState/EmptyState';

interface PokemonListEmptyStateProps {
  isSearching: boolean;
  searchQuery: string;
  searchError: any;
  hasActiveSearch?: boolean;
}

export function PokemonListEmptyState({
  isSearching,
  searchQuery,
  searchError,
  hasActiveSearch = false,
}: PokemonListEmptyStateProps) {
  if (isSearching) {
    return <LoadingSpinner message="Buscando pokémons..." />;
  }

  if (hasActiveSearch && searchQuery.length >= 3) {
    if (searchError) {
      return (
        <EmptyState
          title="Erro na busca"
          message="Houve um problema ao buscar o pokémon. Tente novamente."
          emoji="⚠️"
        />
      );
    }
    
    return (
      <EmptyState
        title="Nenhum pokémon encontrado"
        message={`Não encontramos nenhum pokémon com "${searchQuery}". Verifique a ortografia ou tente outro nome.`}
        emoji="🔍"
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