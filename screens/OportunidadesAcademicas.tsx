import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { FilterSection } from '../components/FilterSection';
import { InfoCard } from '../components/InfoCard';
import { useOportunidades } from '../hooks/useOportunidades';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export function AcademicOpportunitiesScreen() {
  const { oportunidades, loading, error, refetch } = useOportunidades();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const types = useMemo(
    () => ['Bolsa', 'Intercâmbio', 'Competição', 'Programa Acadêmico'],
    []
  );

  const filteredData = useMemo(() => {
    return oportunidades.map((oportunidade) => ({
      id: oportunidade.id_oportunidade,
      title: oportunidade.titulo,
      type: oportunidade.TipoOportunidade?.nome || 'Oportunidade',
      description: oportunidade.descricao,
      institution: 'UTFPR',
      deadline: oportunidade.data_prazo ? new Date(oportunidade.data_prazo).toLocaleDateString('pt-BR') : 'Sem prazo',
      link: oportunidade.link || '#',
    }));
  }, [oportunidades]);

  const clearFilters = () => {
    setSelectedType(null);
  };

  if (loading)
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#030213" />
        <Text style={styles.loadingText}>Carregando oportunidades...</Text>
      </View>
    );

  if (error)
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Erro ao carregar oportunidades</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );

  if (filteredData.length === 0)
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>Nenhuma oportunidade encontrada</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.description}>
            Bolsas de estudo, programas de intercâmbio, competições acadêmicas e oportunidades de desenvolvimento
          </Text>

          <FilterSection
            visible={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
          >
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Tipo</Text>
              <View style={styles.filterOptions}>
                {types.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterChip,
                      selectedType === type && styles.filterChipActive,
                    ]}
                    onPress={() =>
                      setSelectedType(selectedType === type ? null : type)
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedType === type && styles.filterChipTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {selectedType && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearButtonText}>Limpar Filtros</Text>
              </TouchableOpacity>
            )}
          </FilterSection>

          <View style={styles.results}>
            <Text style={styles.resultsText}>
              {filteredData.length}{' '}
              {filteredData.length === 1 ? 'oportunidade' : 'oportunidades'}
            </Text>
          </View>

          <View style={styles.list}>
            {filteredData.map((item) => (
              <InfoCard key={item.id} data={item} type="opportunity" />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: '#717182',
    marginBottom: 16,
    lineHeight: 20,
  },
  filterGroup: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#030213',
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    backgroundColor: '#f3f3f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  filterChipActive: {
    backgroundColor: '#030213',
  },
  filterChipText: {
    fontSize: 12,
    color: '#030213',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  clearButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#d4183d',
    fontWeight: '500',
  },
  results: {
    marginVertical: 12,
  },
  resultsText: {
    fontSize: 12,
    color: '#717182',
  },
  list: {
    gap: 12,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#717182',
  },
  errorText: {
    fontSize: 14,
    color: '#d4183d',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#030213',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#717182',
    textAlign: 'center',
    marginVertical: 24,
  },
});
