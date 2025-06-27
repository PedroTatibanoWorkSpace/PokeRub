import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Pokemon } from '../../../domain/models/Pokemon';
import { PokemonTypeChip } from '../PokemonTypeChip/PokemonTypeChip';
import { FavoriteButton } from '../FavoriteButton/FavoriteButton';
import { getTypeColor } from '../../../core/utils/types/TypesTranslations';
import { styles } from './styles';

interface PokemonCardProps {
  pokemon: Pokemon;
  onPress: () => void;
  cardWidth?: number;
}

export function PokemonCard({ pokemon, onPress, cardWidth }: PokemonCardProps) {
  const imageUrl =
    pokemon.sprites.other['official-artwork'].front_default ||
    pokemon.sprites.front_default;

  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const backgroundColor = getTypeColor(primaryType);

  return (
    <TouchableOpacity
      style={[
        styles.card, 
        { width: cardWidth }
      ]}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View
        style={[
          styles.backgroundGradient,
          { backgroundColor: backgroundColor + '15' },
        ]}
      />

      <View style={styles.header}>
        <Text style={styles.id}>#{pokemon.id.toString().padStart(3, '0')}</Text>
        <FavoriteButton pokemon={pokemon} size="small" />
      </View>

      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>?</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {pokemon.name}
        </Text>

        <View style={styles.typesContainer}>
          {pokemon.types.slice(0, 2).map(type => (
            <PokemonTypeChip
              key={type.type.name}
              typeName={type.type.name}
              size="small"
            />
          ))}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Altura</Text>
            <Text style={styles.statValue}>
              {(pokemon.height / 10).toFixed(1)}m
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Peso</Text>
            <Text style={styles.statValue}>
              {(pokemon.weight / 10).toFixed(1)}kg
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.typeIndicator, { backgroundColor }]} />
    </TouchableOpacity>
  );
}
