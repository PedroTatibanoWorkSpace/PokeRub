import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useIsFavorite, useAddFavorite, useRemoveFavorite } from '../hooks/useFavorites';
import { Pokemon } from '../../domain/models/Pokemon';

interface FavoriteButtonProps {
  pokemon: Pokemon;
  size?: 'small' | 'large';
}

export function FavoriteButton({ pokemon, size = 'large' }: FavoriteButtonProps) {
  const { data: isFavorite = false } = useIsFavorite(pokemon.id);
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();

  const handlePress = () => {
    if (isFavorite) {
      Alert.alert(
        'Remover dos Favoritos',
        `Deseja remover ${pokemon.name} dos favoritos?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Remover', 
            style: 'destructive',
            onPress: () => removeFavorite.mutate(pokemon.id)
          },
        ]
      );
    } else {
      addFavorite.mutate(pokemon);
    }
  };

  const isLoading = addFavorite.isPending || removeFavorite.isPending;

  return (
    <TouchableOpacity 
      style={[
        styles.button,
        size === 'small' && styles.smallButton,
        isFavorite && styles.favoriteButton
      ]}
      onPress={handlePress}
      disabled={isLoading}
    >
      <Text style={[
        styles.icon,
        size === 'small' && styles.smallIcon
      ]}>
        {isFavorite ? '❤️' : '🤍'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  smallButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  favoriteButton: {
    backgroundColor: '#FFE5E5',
  },
  icon: {
    fontSize: 20,
  },
  smallIcon: {
    fontSize: 16,
  },
});