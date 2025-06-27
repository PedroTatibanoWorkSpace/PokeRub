import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ChainLink } from '../../../domain/models/Evolution';
import { usePokemonForEvolution } from '../../hooks/useEvolution';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { styles } from './styles';
import { getEvolutionRequirement } from '../../../core/utils/helpers/HelpersFunctions';

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
            <View style={styles.arrowLine} />
            <View style={styles.arrowCircle}>
              <Text style={styles.arrowText}>⚡</Text>
            </View>
            <View style={styles.arrowLine} />
            {evolution.evolution_details[0] && (
              <View style={styles.evolutionRequirementContainer}>
                <Text style={styles.evolutionRequirement}>
                  {getEvolutionRequirement(evolution.evolution_details[0])}
                </Text>
              </View>
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
        <View style={styles.pokemonImageContainer}>
          <LoadingSpinner message="" />
        </View>
        <View style={styles.pokemonInfoContainer}>
          <View style={styles.placeholderName} />
          <View style={styles.placeholderId} />
        </View>
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
      activeOpacity={0.9}
    >
      <View style={styles.pokemonImageContainer}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.pokemonImage} />
        ) : (
          <View style={[styles.pokemonImage, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>❓</Text>
          </View>
        )}
      </View>

      <View style={styles.pokemonInfoContainer}>
        <Text style={styles.pokemonName} numberOfLines={1}>
          {pokemon.name}
        </Text>
        <Text style={styles.pokemonId}>
          #{pokemon.id.toString().padStart(3, '0')}
        </Text>
      </View>

      <View style={styles.interactionIndicator} />
    </TouchableOpacity>
  );
}

