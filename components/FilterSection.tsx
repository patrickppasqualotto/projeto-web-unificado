import React, { ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterSectionProps {
  visible: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function FilterSection({ visible, onToggle, children }: FilterSectionProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={onToggle}>
        <View style={styles.headerLeft}>
          <Ionicons name="filter" size={18} color="#030213" />
          <Text style={styles.headerText}>Filtros</Text>
        </View>
        <Ionicons
          name={visible ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#717182"
        />
      </TouchableOpacity>
      {visible && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f3f5',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#030213',
  },
  content: {
    padding: 12,
    paddingTop: 0,
  },
});
