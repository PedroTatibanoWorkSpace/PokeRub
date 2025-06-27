import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './styles';

interface EmptyStateProps {
  title: string;
  message: string;
  emoji?: string;
}

export function EmptyState({ title, message, emoji = '🔍' }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

