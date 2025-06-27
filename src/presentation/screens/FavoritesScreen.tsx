import React from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  SafeAreaView,
  RefreshControl,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useFavorites, useClearAllFavorites } from '../hooks/useFavorites';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { PokemonCard } from '../components/PokemonCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { RootStackParamList } from '../../core/config/navigation';
import { Favorite } from '../../domain/models/Favorite';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export function FavoritesScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { data: favorites = [], isLoading, refetch, isFetching } = useFavorites();
  const clearAllFavorites = useClearAllFavorites();

  const handlePokemonPress = (pokemonId: number) => {
    navigation.navigate('PokemonDetail', { pokemonId });
  };

  const handleClearAllFavorites = () => {
    if (favorites.length === 0) return;

    Alert.alert(
      'Limpar Favoritos',
      'Deseja remover todos os pokémons dos favoritos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpar Todos', 
          style: 'destructive',
          onPress: () => {
            clearAllFavorites.mutate();
          }
        },
      ]
    );
  };

  const renderFavoriteItem = ({ item }: { item: Favorite }) => {
    return <FavoriteCardWithDetails favorite={item} onPress={handlePokemonPress} />;
  };

  if (isLoading) {
    return <LoadingSpinner message="Carregando favoritos..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Favoritos</Text>
        <Text style={styles.subtitle}>
          {favorites.length} pokémon{favorites.length !== 1 ? 's' : ''} favorito{favorites.length !== 1 ? 's' : ''}
        </Text>
        
        {favorites.length > 0 && (
          <TouchableOpacity 
            style={[
              styles.clearButton,
              clearAllFavorites.isPending && styles.clearButtonDisabled
            ]}
            onPress={handleClearAllFavorites}
            disabled={clearAllFavorites.isPending}
          >
            <Text style={styles.clearButtonText}>
              {clearAllFavorites.isPending ? 'Limpando...' : 'Limpar Todos'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl 
            refreshing={isFetching} 
            onRefresh={refetch} 
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="Nenhum favorito ainda"
            message="Adicione pokémons aos favoritos tocando no coração nos cards da Pokédex!"
            emoji="💔"
          />
        }
      />
    </SafeAreaView>
  );
}

function FavoriteCardWithDetails({ 
  favorite, 
  onPress 
}: { 
  favorite: Favorite; 
  onPress: (id: number) => void;
}) {
  const { data: pokemonDetails, isLoading } = usePokemonDetail(favorite.id);

  if (isLoading || !pokemonDetails) {
    return (
      <View style={styles.cardPlaceholder}>
        <LoadingSpinner message="" />
      </View>
    );
  }

  return (
    <PokemonCard 
      pokemon={pokemonDetails} 
      onPress={() => onPress(favorite.id)} 
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A202C',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearButton: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FEB2B2',
    borderRadius: 20,
  },
  clearButtonDisabled: {
    backgroundColor: '#E2E8F0',
  },
  clearButtonText: {
    color: '#C53030',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContainer: {
    padding: 8,
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