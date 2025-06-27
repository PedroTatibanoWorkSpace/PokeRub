import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'; 
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { usePokemonDetail } from '../../hooks/usePokemonDetail';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { PokemonTypeChip } from '../../components/PokemonTypeChip/PokemonTypeChip';
import { FavoriteButton } from '../../components/FavoriteButton/FavoriteButton';
import { RootStackParamList } from '../../../core/config/navigation';
import { styles } from './styles';
import { getTypeColor } from '../../../core/utils/types/TypesTranslations';
import { getStatColor, getStatDisplayName } from '../../../core/utils/helpers/HelpersFunctions';

type DetailScreenRouteProp = RouteProp<RootStackParamList, 'PokemonDetail'>;
type NavigationProp = StackNavigationProp<RootStackParamList>;

export function PokemonDetailScreen() {
  const route = useRoute<DetailScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { pokemonId } = route.params;
  
  const { data: pokemon, isLoading, error } = usePokemonDetail(pokemonId);

  const handleEvolutionPress = () => {
    navigation.navigate('Evolution', { pokemonId });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <SafeAreaView style={styles.loadingSafeArea}>
          <LoadingSpinner message="Carregando detalhes..." />
        </SafeAreaView>
      </View>
    );
  }

  if (error || !pokemon) {
    return (
      <View style={styles.errorContainer}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <SafeAreaView style={styles.errorSafeArea}>
          <Text style={styles.errorText}>Erro ao carregar pokémon</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryButtonText}>Voltar</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  const primaryType = pokemon.types[0]?.type.name || 'normal';
  const backgroundColor = getTypeColor(primaryType);
  
  const imageUrl = pokemon.sprites.other['official-artwork'].front_default || 
                   pokemon.sprites.front_default;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <View style={styles.floatingHeader}>
        <SafeAreaView>
          <View style={styles.headerControls}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <FavoriteButton pokemon={pokemon} size="large" />
          </View>
        </SafeAreaView>
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        
        <View style={[styles.heroSection, { backgroundColor }]}>
          <View style={styles.heroGradient} />
          
          <View style={styles.heroContent}>
            <View style={styles.pokemonInfo}>
              <Text style={styles.pokemonId}>#{pokemon.id.toString().padStart(3, '0')}</Text>
              <Text style={styles.pokemonName}>{pokemon.name}</Text>
            </View>

            <View style={styles.typesSection}>
              {pokemon.types.map((type) => (
                <PokemonTypeChip 
                  key={type.type.name} 
                  typeName={type.type.name} 
                  size="medium" 
                />
              ))}
            </View>
          </View>

          <View style={styles.imageSection}>
            <View style={styles.imageBackground}>
              <View style={styles.imageGlow} />
            </View>
            {imageUrl && (
              <Image source={{ uri: imageUrl }} style={styles.pokemonImage} />
            )}
          </View>
        </View>

        <View style={styles.contentSection}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="assessment" size={24} color={backgroundColor} />
              <Text style={styles.cardTitle}>Informações Básicas</Text>
            </View>
            
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <View style={[styles.statIconContainer, { backgroundColor: backgroundColor + '20' }]}>
                  <Icon name="height" size={20} color={backgroundColor} />
                </View>
                <Text style={styles.statValue}>{(pokemon.height / 10).toFixed(1)}m</Text>
                <Text style={styles.statLabel}>Altura</Text>
              </View>
              
              <View style={styles.statBox}>
                <View style={[styles.statIconContainer, { backgroundColor: backgroundColor + '20' }]}>
                  <Icon name="fitness-center" size={20} color={backgroundColor} />
                </View>
                <Text style={styles.statValue}>{(pokemon.weight / 10).toFixed(1)}kg</Text>
                <Text style={styles.statLabel}>Peso</Text>
              </View>
              
              <View style={styles.statBox}>
                <View style={[styles.statIconContainer, { backgroundColor: backgroundColor + '20' }]}>
                  <Icon name="stars" size={20} color={backgroundColor} />
                </View>
                <Text style={styles.statValue}>{pokemon.base_experience}</Text>
                <Text style={styles.statLabel}>Experiência</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="psychology" size={24} color={backgroundColor} />
              <Text style={styles.cardTitle}>Habilidades</Text>
            </View>
            
            <View style={styles.abilitiesContainer}>
              {pokemon.abilities.map((ability, index) => (
                <View key={index} style={[styles.abilityItem, { borderLeftColor: backgroundColor }]}>
                  <View style={styles.abilityContent}>
                    <Text style={styles.abilityName}>
                      {ability.ability.name.replace('-', ' ')}
                    </Text>
                    {ability.is_hidden && (
                      <View style={[styles.hiddenBadge, { backgroundColor: backgroundColor }]}>
                        <Text style={styles.hiddenText}>Oculta</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Icon name="bar-chart" size={24} color={backgroundColor} />
              <Text style={styles.cardTitle}>Estatísticas Base</Text>
            </View>
            
            <View style={styles.statsContainer}>
              {pokemon.stats.map((stat, index) => {
                const percentage = Math.min((stat.base_stat / 200) * 100, 100);
                const statColor = getStatColor(stat.base_stat);
                
                return (
                  <View key={index} style={styles.statItem}>
                    <View style={styles.statHeader}>
                      <Text style={styles.statName}>
                        {getStatDisplayName(stat.stat.name)}
                      </Text>
                      <Text style={[styles.statValue, { color: statColor }]}>
                        {stat.base_stat}
                      </Text>
                    </View>
                    
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBackground}>
                        <View 
                          style={[
                            styles.progressBar, 
                            { 
                              width: `${percentage}%`,
                              backgroundColor: statColor
                            }
                          ]} 
                        />
                      </View>
                    </View>
                  </View>
                );
              })}
              
              <View style={styles.totalStatsContainer}>
                <Text style={styles.totalStatsLabel}>Total</Text>
                <Text style={[styles.totalStatsValue, { color: backgroundColor }]}>
                  {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.evolutionButton, { backgroundColor }]}
            onPress={handleEvolutionPress}
          >
            <Icon name="trending-up" size={24} color="#FFFFFF" />
            <Text style={styles.evolutionButtonText}>Ver Linha Evolutiva</Text>
            <Icon name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
