import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TYPE_COLORS, TYPE_NAMES } from '../../domain/models/PokemonType';

interface PokemonTypeChipProps {
  typeName: string;
  size?: 'small' | 'medium';
}

export function PokemonTypeChip({ typeName, size = 'medium' }: PokemonTypeChipProps) {
  const backgroundColor = TYPE_COLORS[typeName] || '#A8A878';
  const displayName = TYPE_NAMES[typeName] || typeName;

  return (
    <View style={[
      styles.container,
      { backgroundColor },
      size === 'small' && styles.smallContainer
    ]}>
      <Text style={[
        styles.text,
        size === 'small' && styles.smallText
      ]}>
        {displayName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 4,
  },
  smallContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  smallText: {
    fontSize: 10,
  },
});