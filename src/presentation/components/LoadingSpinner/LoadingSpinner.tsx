import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { styles } from './styles';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Carregando...' }: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#E53E3E" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}
