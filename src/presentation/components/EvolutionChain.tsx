import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ChainLink } from '../../domain/models/Evolution';
import { usePokemonForEvolution } from '../hooks/useEvolution';
import { LoadingSpinner } from './LoadingSpinner';

interface EvolutionChainProps {
  chainLink: ChainLink;
  onPokemonPress: (pokemonName: string) => void;
}

export function EvolutionChain({
  chainLink,
  onPokemonPress,
}: EvolutionChainProps) {
  return (
    <View style={styles.container}>
      <EvolutionStage chainLink={chainLink} onPress={onPokemonPress} />

      {chainLink.evolves_to.map((evolution, index) => (
        <View key={index} style={styles.evolutionContainer}>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrowText}>↓</Text>
            {evolution.evolution_details[0] && (
              <Text style={styles.evolutionRequirement}>
                {getEvolutionRequirement(evolution.evolution_details[0])}
              </Text>
            )}
          </View>
          <EvolutionChain
            chainLink={evolution}
            onPokemonPress={onPokemonPress}
          />
        </View>
      ))}
    </View>
  );
}

function EvolutionStage({
  chainLink,
  onPress,
}: {
  chainLink: ChainLink;
  onPress: (name: string) => void;
}) {
  const pokemonName = chainLink.species.name;
  const { data: pokemon, isLoading } = usePokemonForEvolution(pokemonName);

  if (isLoading || !pokemon) {
    return (
      <View style={styles.pokemonContainer}>
        <LoadingSpinner message="" />
      </View>
    );
  }

  const imageUrl =
    pokemon.sprites.other['official-artwork'].front_default ||
    pokemon.sprites.front_default;

  return (
    <TouchableOpacity
      style={styles.pokemonContainer}
      onPress={() => onPress(pokemonName)}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.pokemonImage} />
      ) : (
        <View style={[styles.pokemonImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>?</Text>
        </View>
      )}

      <Text style={styles.pokemonName}>{pokemon.name}</Text>

      <Text style={styles.pokemonId}>
        #{pokemon.id.toString().padStart(3, '0')}
      </Text>
    </TouchableOpacity>
  );
}

function getEvolutionRequirement(evolutionDetail: any): string {
  if (evolutionDetail.min_level) {
    return `Nível ${evolutionDetail.min_level}`;
  }

  if (evolutionDetail.item) {
    return `${evolutionDetail.item.name.replace('-', ' ')}`;
  }

  if (evolutionDetail.trigger?.name === 'trade') {
    return 'Troca';
  }

  if (evolutionDetail.min_happiness) {
    return `Felicidade ${evolutionDetail.min_happiness}`;
  }

  return evolutionDetail.trigger?.name || 'Condição especial';
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  evolutionContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  arrowContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  arrowText: {
    fontSize: 24,
    color: '#E53E3E',
    fontWeight: 'bold',
  },
  evolutionRequirement: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    textTransform: 'capitalize',
  },
  pokemonContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 140,
  },
  pokemonImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  placeholderImage: {
    backgroundColor: '#F0F0F0',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
    color: '#CCC',
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A202C',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  pokemonId: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
});
