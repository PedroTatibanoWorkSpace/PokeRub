import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { FilterOptions } from '../../hooks/useSearchAndFilters';
import { translateType, getTypeColor, ALL_TYPES } from '../../../core/utils/types/TypesTranslations';
import { styles } from './styles';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export function FilterModal({
  visible,
  onClose,
  onApplyFilters,
  currentFilters,
}: FilterModalProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      setSelectedTypes(currentFilters.types);
    }
  }, [visible, currentFilters.types]);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

const handleApply = () => {
  onApplyFilters({
    types: selectedTypes,
  });
  onClose();
};

  const handleClear = () => {
    setSelectedTypes([]);
  };

  const handleClose = () => {
    setSelectedTypes(currentFilters.types);
    onClose();
  };

  const hasFilters = selectedTypes.length > 0;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>Filtrar por Tipo</Text>
          
          <TouchableOpacity 
            style={[styles.clearButton, !hasFilters && styles.clearButtonDisabled]} 
            onPress={handleClear}
            disabled={!hasFilters}
          >
            <Text style={[
              styles.clearButtonText,
              !hasFilters && styles.clearButtonTextDisabled
            ]}>
              Limpar
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Selecione os tipos ({selectedTypes.length} selecionados)
            </Text>
            
            <View style={styles.typesContainer}>
              {ALL_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor: selectedTypes.includes(type) 
                        ? getTypeColor(type) 
                        : '#F7F7F7'
                    }
                  ]}
                  onPress={() => handleTypeToggle(type)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      selectedTypes.includes(type) && styles.typeButtonTextSelected,
                    ]}
                  >
                    {translateType(type)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedTypes.length > 0 && (
              <View style={styles.selectedTypesContainer}>
                <Text style={styles.selectedTypesTitle}>Tipos selecionados:</Text>
                <View style={styles.selectedTypesList}>
                  {selectedTypes.map((type) => (
                    <View 
                      key={type}
                      style={[
                        styles.selectedTypeTag,
                        { backgroundColor: getTypeColor(type) }
                      ]}
                    >
                      <Text style={styles.selectedTypeText}>
                        {translateType(type)}
                      </Text>
                      <TouchableOpacity 
                        onPress={() => handleTypeToggle(type)}
                        style={styles.removeTypeButton}
                      >
                        <Text style={styles.removeTypeText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApply}
            activeOpacity={0.8}
          >
            <Text style={styles.applyButtonText}>
              {hasFilters 
                ? `Filtrar por ${selectedTypes.length} tipo${selectedTypes.length > 1 ? 's' : ''}`
                : 'Mostrar Todos os Pokémons'
              }
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
