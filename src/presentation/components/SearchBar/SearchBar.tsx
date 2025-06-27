import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Animated
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from './styles';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export function SearchBar({ 
  value, 
  onChangeText, 
  onClear, 
  placeholder = 'Buscar pokémon...' 
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(scaleValue, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ scale: scaleValue }] }
      ]}
    >
      <View style={[
        styles.searchContainer,
        isFocused && styles.searchContainerFocused,
        value.length > 0 && styles.searchContainerActive
      ]}>
        <View style={styles.iconContainer}>
          <Icon 
            name="search" 
            size={22} 
            color={isFocused ? '#3B82F6' : '#9CA3AF'} 
          />
        </View>
        
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          selectionColor="#3B82F6"
        />
        
        {value.length > 0 && (
          <TouchableOpacity onPress={onClear} style={styles.clearButton}>
            <Icon name="close" size={18} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}
