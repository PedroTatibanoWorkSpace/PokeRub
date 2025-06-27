import React from 'react';
import { View, Text } from 'react-native';
import { translateType, getTypeColor } from '../../../core/utils/types/TypesTranslations';
import { styles } from './styles';

interface PokemonTypeChipProps {
  typeName: string;
  size?: 'small' | 'medium';
}

export function PokemonTypeChip({ typeName, size = 'medium' }: PokemonTypeChipProps) {
  const backgroundColor = getTypeColor(typeName);
  const displayName = translateType(typeName);

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
