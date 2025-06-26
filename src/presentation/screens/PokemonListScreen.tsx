import React, { useState, useMemo } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { usePokemonList } from '../hooks/usePokemonList';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { useSearchAndFilters, FilterOptions } from '../hooks/useSearchAndFilters';
import { PokemonCard } from '../components/PokemonCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { FilterModal } from '../components/FilterModal';
import { PokemonListHeader } from '../components/PokemonListHeader';
import { PokemonListEmptyState } from '../components/PokemonListEmptyState';
import { RootStackParamList } from '../../core/config/navigation';
import { PokemonListItem, Pokemon } from '../../domain/models/Pokemon';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export function PokemonListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [showFilters, setShowFilters] = useState(false);
  
  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage, 
    isLoading, 
    refetch,
    isFetching
  } = usePokemonList();

  const pokemonList = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.results);
  }, [data]);

  const {
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
  } = useSearchAndFilters(pokemonList);

  const handlePokemonPress = (pokemonId: number) => {
    navigation.navigate('PokemonDetail', { pokemonId });
  };

  const handleLoadMore = () => {
    if (hasNextPage && 
        !isFetchingNextPage && 
        !debouncedSearchQuery && 
        !hasActiveFilters) { 
      fetchNextPage();
    }
  };

  const renderPokemonItem = ({ item }: { item: PokemonListItem | Pokemon }) => {
    if ('sprites' in item) {
      return (
        <PokemonCard 
          pokemon={item as Pokemon} 
          onPress={() => handlePokemonPress(item.id)} 
        />
      );
    }
    
    return (
      <PokemonCardWithFilters 
        pokemon={item as PokemonListItem} 
        onPress={handlePokemonPress}
        filters={filters}
      />
    );
  };

  const renderFooter = () => {
    if (isFetchingNextPage && !hasActiveFilters && !debouncedSearchQuery) {
      return (
        <View style={styles.footerLoader}>
          <LoadingSpinner message="Carregando mais pokémons..." />
        </View>
      );
    }
    return null;
  };

  if (isLoading) {
    return <LoadingSpinner message="Carregando Pokédex..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <PokemonListHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClear={() => setSearchQuery('')}
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onOpenFilters={() => setShowFilters(true)}
        onClearFilters={clearFilters}
      />

      <FlatList
        data={displayedPokemon}
        renderItem={renderPokemonItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl 
            refreshing={isFetching && !isFetchingNextPage} 
            onRefresh={refetch} 
          />
        }
        ListEmptyComponent={
          <PokemonListEmptyState
            isSearching={isSearching}
            searchQuery={debouncedSearchQuery}
            searchError={searchError}
            hasActiveFilters={hasActiveFilters}
          />
        }
      />

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApplyFilters={setFilters}
        currentFilters={filters}
      />
    </SafeAreaView>
  );
}

function PokemonCardWithFilters({ 
  pokemon, 
  onPress,
  filters
}: { 
  pokemon: PokemonListItem; 
  onPress: (id: number) => void;
  filters: FilterOptions;
}) {
  const { data: pokemonDetails, isLoading, error } = usePokemonDetail(pokemon.id);

  if (error || (!isLoading && !pokemonDetails)) {
    return null;
  }

  if (isLoading || !pokemonDetails) {
    return (
      <View style={styles.cardPlaceholder}>
        <LoadingSpinner message="" />
      </View>
    );
  }

  const passesTypeFilter = () => {
    if (filters.types.length === 0) return true;
    
    const pokemonTypes = pokemonDetails.types.map(t => t.type.name);
    return filters.types.some(filterType => pokemonTypes.includes(filterType));
  };

  if (!passesTypeFilter()) {
    return null;
  }

  return (
    <PokemonCard 
      pokemon={pokemonDetails} 
      onPress={() => onPress(pokemon.id)} 
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    padding: 8,
  },
  footerLoader: {
    height: 80,
    justifyContent: 'center',
  },
  cardPlaceholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    margin: 8,
    height: 240,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});