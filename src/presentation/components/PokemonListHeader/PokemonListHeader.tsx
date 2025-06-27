import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SearchBar } from '../SearchBar/SearchBar';
import { styles } from './styles';

interface PokemonListHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchClear: () => void;
}

export function PokemonListHeader({
  searchQuery,
  onSearchChange,
  onSearchClear,
}: PokemonListHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headerBackground} />

      <View style={styles.headerContent}>
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <View style={styles.iconContainer}>
              <Icon name="catching-pokemon" size={28} color="#3B82F6" />
            </View>
            <Text style={styles.title}>PokéRub</Text>
          </View>

          <Text style={styles.subtitle}>
            Descubra e explore o mundo Pokémon
          </Text>
        </View>

        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={onSearchChange}
            onClear={onSearchClear}
            placeholder="Buscar pokémon por nome ou número..."
          />
        </View>

        {searchQuery.length >= 3 && (
          <View style={styles.statusSection}>
            <View style={styles.statusChip}>
              <Icon name="search" size={14} color="#10B981" />
              <Text style={styles.statusText}>
                Buscando "{' '}
                {searchQuery.length > 12
                  ? searchQuery.substring(0, 12) + '...'
                  : searchQuery}
                "
              </Text>
              <View style={styles.loadingDot} />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
