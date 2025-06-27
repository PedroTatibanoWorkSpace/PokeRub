import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useIsFavorite, useAddFavorite, useRemoveFavorite } from '../../hooks/useFavorites';
import { Pokemon } from '../../../domain/models/Pokemon';
import { styles } from './styles';

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
      activeOpacity={0.8}
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
