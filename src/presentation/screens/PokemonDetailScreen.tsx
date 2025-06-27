import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'; 
import { StackNavigationProp } from '@react-navigation/stack';

import { usePokemonDetail } from '../hooks/usePokemonDetail';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { PokemonTypeChip } from '../components/PokemonTypeChip';
import { FavoriteButton } from '../components/FavoriteButton';
import { RootStackParamList } from '../../core/config/navigation';
import { TYPE_COLORS } from '../../domain/models/PokemonType';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'PokemonDetail'>;
type NavigationProp = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');

export function PokemonDetailScreen() {
  const route = useRoute<DetailScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { pokemonId } = route.params;
  
  const { data: pokemon, isLoading, error } = usePokemonDetail(pokemonId);

  const handleEvolutionPress = () => {
    navigation.navigate('Evolution', { pokemonId });
  };

  if (isLoading) {
    return <LoadingSpinner message="Carregando detalhes..." />;
  }

  if (error || !pokemon) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro ao carregar pokémon</Text>
      </View>
    );
  }

  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const backgroundGradient = TYPE_COLORS[primaryType] || '#A8A878';
  
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default || 
                   pokemon.sprites.front_default;

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.headerContainer, { backgroundColor: backgroundGradient }]}>
        <View style={styles.headerContent}>
          <View style={styles.pokemonInfo}>
            <Text style={styles.pokemonId}>#{pokemon.id.toString().padStart(3, '0')}</Text>
            <Text style={styles.pokemonName}>{pokemon.name}</Text>
            
            <View style={styles.typesContainer}>
              {pokemon.types.map((type) => (
                <PokemonTypeChip 
                  key={type.type.name} 
                  typeName={type.type.name} 
                  size="medium" 
                />
              ))}
            </View>
          </View>
          
          <View style={styles.favoriteButtonContainer}>
            <FavoriteButton pokemon={pokemon} size="large" />
          </View>
        </View>
        
        {imageUrl && (
          <Image source={{ uri: imageUrl }} style={styles.pokemonImage} />
        )}
      </View>

      {/* Informações básicas */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Informações Básicas</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Altura</Text>
            <Text style={styles.statValue}>{pokemon.height / 10}m</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Peso</Text>
            <Text style={styles.statValue}>{pokemon.weight / 10}kg</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Experiência</Text>
            <Text style={styles.statValue}>{pokemon.base_experience}</Text>
          </View>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Habilidades</Text>
        <View style={styles.abilitiesContainer}>
          {pokemon.abilities.map((ability, index) => (
            <View key={index} style={styles.abilityItem}>
              <Text style={styles.abilityName}>
                {ability.ability.name.replace('-', ' ')}
                {ability.is_hidden && ' (Oculta)'}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Estatísticas</Text>
        {pokemon.stats.map((stat, index) => {
          const percentage = (stat.base_stat / 150) * 100; 
          return (
            <View key={index} style={styles.statRow}>
              <Text style={styles.statName}>
                {getStatDisplayName(stat.stat.name)}
              </Text>
              <View style={styles.statBarContainer}>
                <View 
                  style={[
                    styles.statBar, 
                    { 
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: getStatColor(stat.base_stat)
                    }
                  ]} 
                />
              </View>
              <Text style={styles.statNumber}>{stat.base_stat}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.actionSection}>
        <TouchableOpacity 
          style={[styles.evolutionButton, { backgroundColor: backgroundGradient }]}
          onPress={handleEvolutionPress}
        >
          <Text style={styles.evolutionButtonText}>
            🔄 Ver Evoluções
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// Funções auxiliares
function getStatDisplayName(statName: string): string {
  const statNames: Record<string, string> = {
    'hp': 'HP',
    'attack': 'Ataque',
    'defense': 'Defesa',
    'special-attack': 'At. Especial',
    'special-defense': 'Def. Especial',
    'speed': 'Velocidade',
  };
  return statNames[statName] || statName;
}

function getStatColor(value: number): string {
  if (value >= 100) return '#48BB78'; 
  if (value >= 70) return '#F6E05E'; 
  if (value >= 40) return '#FBB6CE'; 
  return '#FEB2B2'; 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pokemonInfo: {
    flex: 1,
  },
  pokemonId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  pokemonName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textTransform: 'capitalize',
    marginVertical: 8,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  favoriteButtonContainer: {
    marginTop: 10,
  },
  pokemonImage: {
    width: width * 0.6,
    height: width * 0.6,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  abilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  abilityItem: {
    backgroundColor: '#F7F7F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  abilityName: {
    fontSize: 14,
    color: '#1A202C',
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statName: {
    width: 100,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  statBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    marginHorizontal: 12,
  },
  statBar: {
    height: '100%',
    borderRadius: 4,
  },
  statNumber: {
    width: 40,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1A202C',
  },
  actionSection: {
    margin: 16,
    marginBottom: 32,
  },
  evolutionButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
  },
  evolutionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#F56565',
  },
});