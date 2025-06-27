import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SearchBar } from './SearchBar';
import { FilterOptions, getActiveFiltersCount } from '../hooks/useSearchAndFilters';

interface PokemonListHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchClear: () => void;
  filters: FilterOptions;
  hasActiveFilters: boolean;
  onOpenFilters: () => void;
  onClearFilters: () => void;
}

export function PokemonListHeader({
  searchQuery,
  onSearchChange,
  onSearchClear,
  filters,
  hasActiveFilters,
  onOpenFilters,
  onClearFilters,
}: PokemonListHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Pokédex</Text>
      
      <SearchBar
        value={searchQuery}
        onChangeText={onSearchChange}
        onClear={onSearchClear}
        placeholder="Buscar pokémon (ex: pikachu)..."
      />
      
      <View style={styles.filtersRow}>
        <TouchableOpacity 
          style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
          onPress={onOpenFilters}
        >
          <Text style={[styles.filterButtonText, hasActiveFilters && styles.filterButtonTextActive]}>
            🎯 Filtros {hasActiveFilters && `(${getActiveFiltersCount(filters)})`}
          </Text>
        </TouchableOpacity>
        
        {hasActiveFilters && (
          <TouchableOpacity 
            style={styles.clearFiltersButton}
            onPress={onClearFilters}
          >
            <Text style={styles.clearFiltersText}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 8,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    alignItems: 'center',
  },
  filterButton: {
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#E53E3E',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#E53E3E',
    fontWeight: '600',
  },
});