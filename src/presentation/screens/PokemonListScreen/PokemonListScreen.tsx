import React, { useMemo } from 'react';
import {
  View,
  FlatList,
  SafeAreaView,
  RefreshControl,
  Dimensions,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSearchAndFilters } from '../../hooks/useSearchAndFilters';
import { usePokemonList } from '../../hooks/usePokemonList';
import { usePokemonDetail } from '../../hooks/usePokemonDetail';
import { PokemonCard } from '../../components/PokemonCard/PokemonCard';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { PokemonListHeader } from '../../components/PokemonListHeader/PokemonListHeader';
import { PokemonListEmptyState } from '../../components/PokemonListEmptyState/PokemonListEmptyState';
import { RootStackParamList } from '../../../core/config/navigation';
import { PokemonListItem, Pokemon } from '../../../domain/models/Pokemon';
import { styles } from './styles';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

const HORIZONTAL_PADDING = 16;
const CARD_GAP = 12;
const CARD_WIDTH = Math.floor((width - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2);

export function PokemonListScreen() {
  const navigation = useNavigation<NavigationProp>();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isFetching,
  } = usePokemonList();

  const pokemonList = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.results);
  }, [data]);

  const {
    searchQuery,
    setSearchQuery,
    displayedPokemon,
    isSearching,
    searchError,
    debouncedSearchQuery,
  } = useSearchAndFilters(pokemonList);

  const handlePokemonPress = (pokemonId: number) => {
    navigation.navigate('PokemonDetail', { pokemonId });
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage && !debouncedSearchQuery) {
      fetchNextPage();
    }
  };

  const renderPokemonItem = ({
    item,
    index,
  }: {
    item: PokemonListItem | Pokemon;
    index: number;
  }) => {
    if ('sprites' in item) {
      return (
        <PokemonCard
          pokemon={item as Pokemon}
          onPress={() => handlePokemonPress(item.id)}
          cardWidth={CARD_WIDTH}
        />
      );
    }

    return (
      <PokemonCardWithFilters
        pokemon={item as PokemonListItem}
        onPress={handlePokemonPress}
        index={index}
        cardWidth={CARD_WIDTH}
      />
    );
  };

  const renderFooter = () => {
    if (isFetchingNextPage && !debouncedSearchQuery) {
      return (
        <View style={styles.footerLoader}>
          <LoadingSpinner message="Carregando mais pokémons..." />
        </View>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <SafeAreaView style={styles.loadingContainer}>
          <LoadingSpinner message="Carregando Pokédex..." />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <SafeAreaView style={styles.safeArea}>
        <PokemonListHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSearchClear={() => setSearchQuery('')}
        />

        <FlatList
          data={displayedPokemon}
          renderItem={renderPokemonItem}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.row}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          refreshControl={
            <RefreshControl
              refreshing={isFetching && !isFetchingNextPage}
              onRefresh={refetch}
              tintColor="#007AFF"
              colors={['#007AFF']}
            />
          }
          ListEmptyComponent={
            <PokemonListEmptyState
              isSearching={isSearching}
              searchQuery={debouncedSearchQuery}
              searchError={searchError}
            />
          }
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={10}
        />
      </SafeAreaView>
    </View>
  );
}

function PokemonCardWithFilters({
  pokemon,
  onPress,
  index,
  cardWidth,
}: {
  pokemon: PokemonListItem;
  onPress: (id: number) => void;
  index: number;
  cardWidth: number;
}) {
  const {
    data: pokemonDetails,
    isLoading,
    error,
  } = usePokemonDetail(pokemon.id);

  if (error) {
    return null;
  }

  if (isLoading || !pokemonDetails) {
    return (
      <View style={[styles.cardPlaceholder, { width: cardWidth }]}>
        <View style={styles.placeholderAnimation}>
          <View style={styles.placeholderImage} />
          <View style={styles.placeholderText} />
          <View style={styles.placeholderTypes}>
            <View style={styles.placeholderType} />
            <View style={styles.placeholderType} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <PokemonCard
      pokemon={pokemonDetails}
      onPress={() => onPress(pokemon.id)}
      cardWidth={cardWidth}
    />
  );
}
