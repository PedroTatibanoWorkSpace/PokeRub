import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { FilterOptions } from '../hooks/useSearchAndFilters';
import { translateType, getTypeColor, ALL_TYPES } from '../../core/utils/types/TypesTranslations';

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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  closeButton: {
    padding: 8,
    minWidth: 44,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A202C',
    flex: 1,
    textAlign: 'center',
  },
  clearButtonDisabled: {
    opacity: 0.5,
  },
  clearButton: {
    padding: 8,
    minWidth: 44,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#E53E3E',
    fontWeight: '600',
    textAlign: 'center',
  },
  clearButtonTextDisabled: {
    color: '#CBD5E0',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 16,
    textAlign: 'center',
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A202C',
  },
  typeButtonTextSelected: {
    color: '#FFFFFF',
  },
  selectedTypesContainer: {
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  selectedTypesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 12,
  },
  selectedTypesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  selectedTypeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  selectedTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  removeTypeButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeTypeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  applyButton: {
    backgroundColor: '#E53E3E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#E53E3E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});