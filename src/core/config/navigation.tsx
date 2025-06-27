import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { PokemonListScreen } from '../../presentation/screens/PokemonListScreen/PokemonListScreen';
import { PokemonDetailScreen } from '../../presentation/screens/PokemonDetailScreen/PokemonDetailScreen';
import { FavoritesScreen } from '../../presentation/screens/FavoritesScreen/FavoritesScreen';
import { EvolutionScreen } from '../../presentation/screens/EvolutionScreen/EvolutionScreen';

export type RootStackParamList = {
  Main: undefined;
  PokemonDetail: { pokemonId: number };
  Evolution: { pokemonId: number };
};

export type TabParamList = {
  PokemonList: undefined;
  Favorites: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;
          
          if (route.name === 'PokemonList') {
            iconName = 'apps'; 
          } else {
            iconName = 'favorite'; 
          }
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#E53E3E',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="PokemonList" 
        component={PokemonListScreen}
        options={{ title: 'Pokédex' }}
      />
      <Tab.Screen 
        name="Favorites" 
        component={FavoritesScreen}
        options={{ title: 'Favoritos' }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="PokemonDetail" 
        component={PokemonDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Evolution" 
        component={EvolutionScreen}
        options={{ title: 'Evolução' }}
      />
    </Stack.Navigator>
  );
}