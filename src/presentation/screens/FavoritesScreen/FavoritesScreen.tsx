import React, { useState } from 'react';
import {
  View,
  FlatList,
  SafeAreaView,
  RefreshControl,
  Text,
  TouchableOpacity,
  Alert,
  StatusBar,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useFavorites, useClearAllFavorites } from '../../hooks/useFavorites';
import { usePokemonDetail } from '../../hooks/usePokemonDetail';
import { PokemonCard } from '../../components/PokemonCard/PokemonCard';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState/EmptyState';
import { RootStackParamList } from '../../../core/config/navigation';
import { Favorite } from '../../../domain/models/Favorite';
import { styles } from './styles';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export function FavoritesScreen() {

  const { width: screenWidth } = Dimensions.get('window');
  const HORIZONTAL_PADDING = 16;
  const CARD_GAP = 12;
  const CARD_WIDTH = Math.floor((screenWidth - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2);

  const navigation = useNavigation<NavigationProp>();
  const { data: favorites = [], isLoading, refetch, isFetching } = useFavorites();
  const clearAllFavorites = useClearAllFavorites();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handlePokemonPress = (pokemonId: number) => {
    navigation.navigate('PokemonDetail', { pokemonId });
  };

  const handleClearAllFavorites = () => {
    if (favorites.length === 0) return;

    Alert.alert(
      'Limpar Favoritos',
      'Tem certeza que deseja remover todos os pokémons dos favoritos? Esta ação não pode ser desfeita.',
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

  const renderFavoriteItem = ({ item, index }: { item: Favorite; index: number }) => {
    if (viewMode === 'list') {
      return (
        <View style={styles.listItemWrapper}>
          <FavoriteCardWithDetails
            favorite={item}
            onPress={handlePokemonPress}
            viewMode={viewMode}
            index={index}
            cardWidth={screenWidth - (HORIZONTAL_PADDING * 2)}
          />
        </View>
      );
    }

    return (
      <View style={styles.gridItemWrapper}>
        <FavoriteCardWithDetails
          favorite={item}
          onPress={handlePokemonPress}
          viewMode={viewMode}
          index={index}
          cardWidth={CARD_WIDTH}
        />
      </View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerBackground} />

      <View style={styles.headerContent}>
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <View style={styles.heartIcon}>
              <Icon name="favorite" size={24} color="#FF6B6B" />
            </View>
            <Text style={styles.title}>Meus Favoritos</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Icon name="catching-pokemon" size={16} color="#3B82F6" />
              <Text style={styles.statText}>
                {favorites.length} pokémon{favorites.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[styles.toggleButton, viewMode === 'grid' && styles.toggleButtonActive]}
              onPress={() => setViewMode('grid')}
            >
              <Icon name="grid-view" size={16} color={viewMode === 'grid' ? '#FFFFFF' : '#6B7280'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
              onPress={() => setViewMode('list')}
            >
              <Icon name="view-list" size={16} color={viewMode === 'list' ? '#FFFFFF' : '#6B7280'} />
            </TouchableOpacity>
          </View>

          {favorites.length > 0 && (
            <TouchableOpacity
              style={[
                styles.clearButton,
                clearAllFavorites.isPending && styles.clearButtonDisabled
              ]}
              onPress={handleClearAllFavorites}
              disabled={clearAllFavorites.isPending}
            >
              <Icon
                name={clearAllFavorites.isPending ? "hourglass-empty" : "delete-sweep"}
                size={16}
                color="#EF4444"
              />
              <Text style={styles.clearButtonText}>
                {clearAllFavorites.isPending ? 'Limpando...' : 'Limpar'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <SafeAreaView style={styles.loadingContainer}>
          <LoadingSpinner message="Carregando seus favoritos..." />
        </SafeAreaView>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent={true}
        />
        <SafeAreaView style={styles.safeArea}>
          {renderHeader()}
          <View style={styles.emptyContainer}>
            <EmptyState
              title="Sua coleção está vazia"
              message="Que tal começar adicionando alguns pokémons aos favoritos? Toque no coração nos cards da Pokédex!"
              emoji="💝"
            />
          </View>
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
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={viewMode === 'grid' ? styles.row : undefined}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              tintColor="#FF6B6B"
              colors={["#FF6B6B"]}
            />
          }
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={8}
        />
      </SafeAreaView>
    </View>
  );
}

function FavoriteCardWithDetails({
  favorite,
  onPress,
  viewMode,
  index,
  cardWidth
}: {
  favorite: Favorite;
  onPress: (id: number) => void;
  viewMode: 'grid' | 'list';
  index: number;
  cardWidth: number;
}) {
  const { data: pokemonDetails, isLoading, error } = usePokemonDetail(favorite.id);

  if (error) {
    return (
      <View style={[
        styles.errorCard,
        { width: cardWidth },
        viewMode === 'list' && styles.errorCardList
      ]}>
        <Icon name="error-outline" size={24} color="#EF4444" />
        <Text style={styles.errorText}>Erro ao carregar</Text>
      </View>
    );
  }

  if (isLoading || !pokemonDetails) {
    return (
      <View style={[
        styles.cardPlaceholder,
        { width: cardWidth },
        viewMode === 'list' && styles.cardPlaceholderList
      ]}>
        <View style={styles.placeholderContent}>
          <View style={styles.placeholderImage} />
          <View style={styles.placeholderTextContainer}>
            <View style={styles.placeholderText} />
            <View style={styles.placeholderSubtext} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.cardWithBadges}>
      <PokemonCard
        pokemon={pokemonDetails}
        onPress={() => onPress(favorite.id)}
        cardWidth={cardWidth}
      />

      <View style={styles.favoriteIndicator}>
        <Icon name="favorite" size={12} color="#FF6B6B" />
      </View>

      <View style={styles.positionBadge}>
        <Text style={styles.positionText}>#{index + 1}</Text>
      </View>
    </View>
  );
}
