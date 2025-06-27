import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useEvolutionChain } from '../hooks/useEvolution';
import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { usePokemonIdByName } from '../hooks/usePokemonByName';
import { EvolutionChain } from '../components/EvolutionChain';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { EmptyState } from '../components/EmptyState';
import { RootStackParamList } from '../../core/config/navigation';

type EvolutionScreenRouteProp = RouteProp<RootStackParamList, 'Evolution'>;
type NavigationProp = StackNavigationProp<RootStackParamList>;

export function EvolutionScreen() {
  const route = useRoute<EvolutionScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { pokemonId } = route.params;
  
  const { data: pokemon } = usePokemonDetail(pokemonId);
  const { data: evolutionChain, isLoading, error } = useEvolutionChain(pokemonId);
  
  const getPokemonIdMutation = usePokemonIdByName();

  const handlePokemonPress = async (pokemonName: string) => {
    try {
      const pokemonId = await getPokemonIdMutation.mutateAsync(pokemonName);
      navigation.push('PokemonDetail', { pokemonId });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes deste pokémon.');
    }
  };

  const handleEvolvePokemon = () => {
    Alert.alert(
      'Evoluir Pokémon',
      `Esta é uma funcionalidade demonstrativa. Em um jogo real, ${pokemon?.name} seria evoluído aqui.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Evoluir', 
          onPress: () => {
            Alert.alert('Sucesso!', `${pokemon?.name} foi evoluído!`);
          }
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Carregando cadeia evolutiva..." />;
  }

  if (error || !evolutionChain) {
    return (
      <EmptyState
        title="Erro ao carregar evoluções"
        message="Não foi possível carregar as informações de evolução deste pokémon."
        emoji="⚠️"
      />
    );
  }

  const hasEvolutions = evolutionChain.chain.evolves_to.length > 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Cadeia Evolutiva</Text>
        <Text style={styles.subtitle}>
          {pokemon ? `de ${pokemon.name}` : ''}
        </Text>
      </View>

      <View style={styles.evolutionContainer}>
        <EvolutionChain 
          chainLink={evolutionChain.chain}
          onPokemonPress={handlePokemonPress}
        />
      </View>

      {hasEvolutions && (
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.evolveButton}
            onPress={handleEvolvePokemon}
          >
            <Text style={styles.evolveButtonText}>
              🎯 Evoluir Pokémon
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.disclaimerText}>
            * Esta é uma funcionalidade demonstrativa
          </Text>
        </View>
      )}

      {!hasEvolutions && (
        <View style={styles.noEvolutionContainer}>
          <EmptyState
            title="Sem evoluções"
            message="Este pokémon não possui evoluções disponíveis."
            emoji="🔚"
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textTransform: 'capitalize',
  },
  evolutionContainer: {
    padding: 20,
    alignItems: 'center',
  },
  actionContainer: {
    padding: 20,
    alignItems: 'center',
  },
  evolveButton: {
    backgroundColor: '#E53E3E',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    marginBottom: 10,
  },
  evolveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  noEvolutionContainer: {
    padding: 20,
  },
});