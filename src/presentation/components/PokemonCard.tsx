import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { Pokemon } from '../../domain/models/Pokemon';
import { PokemonTypeChip } from './PokemonTypeChip';
import { FavoriteButton } from './FavoriteButton';

interface PokemonCardProps {
  pokemon: Pokemon;
  onPress: () => void;
}

export function PokemonCard({ pokemon, onPress }: PokemonCardProps) {
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default || 
                   pokemon.sprites.front_default;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>?</Text>
          </View>
        )}
        <View style={styles.favoriteButton}>
          <FavoriteButton pokemon={pokemon} size="small" />
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.id}>#{pokemon.id.toString().padStart(3, '0')}</Text>
        <Text style={styles.name}>{pokemon.name}</Text>
        
        <View style={styles.typesContainer}>
          {pokemon.types.map((type) => (
            <PokemonTypeChip 
              key={type.type.name} 
              typeName={type.type.name} 
              size="small" 
            />
          ))}
        </View>
        
        <View style={styles.stats}>
          <Text style={styles.stat}>Altura: {pokemon.height / 10}m</Text>
          <Text style={styles.stat}>Peso: {pokemon.weight / 10}kg</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 12,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  placeholderImage: {
    backgroundColor: '#F0F0F0',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 48,
    color: '#CCC',
  },
  favoriteButton: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  content: {
    alignItems: 'center',
  },
  id: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
    textTransform: 'capitalize',
    marginVertical: 4,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 8,
  },
  stats: {
    marginTop: 8,
  },
  stat: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});