import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilterSection } from '../components/FilterSection';
import { InfoCard } from '../components/InfoCard';
import { useInformacoes } from '../hooks/useInformacoes';

export function UniversityInfoScreen() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Buscar dados da API
  const { informacoes, loading, error, refetch } = useInformacoes();

  // Transformar dados da API para formato esperado
  const transformedData = useMemo(() => {
    return informacoes.map((info) => ({
      id: String(info.id_informacoes),
      title: info.titulo || 'Sem título',
      category: 'Informação',
      department: 'UTFPR',
      date: info.ultima_att,
      description: info.conteudo || 'Sem descrição',
      endereco: info.endereco,
      telefone: info.telefone,
      email: info.email,
      link: '#',
    }));
  }, [informacoes]);

  // Extrair categorias
  const categories = Array.from(new Set(transformedData.map((item) => item.category)));

  // Aplicar filtros
  const filteredData = transformedData.filter((item) => {
    if (selectedCategory && item.category !== selectedCategory) return false;
    return true;
  });

  // Limpar filtros
  const clearFilters = () => {
    setSelectedCategory(null);
  };

  const hasActiveFilters = selectedCategory;

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#030213" />
        <Text style={styles.loadingText}>Carregando informações...</Text>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Erro ao carregar informações</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.description}>
            Informações institucionais, regulamentos, serviços e calendários da
            universidade
          </Text>

          <FilterSection
            visible={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
          >
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Categoria</Text>
              <View style={styles.filterOptions}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterChip,
                      selectedCategory === category && styles.filterChipActive,
                    ]}
                    onPress={() =>
                      setSelectedCategory(
                        selectedCategory === category ? null : category
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedCategory === category &&
                          styles.filterChipTextActive,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {hasActiveFilters && (
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
              {filteredData.length === 1 ? 'resultado' : 'resultados'}
            </Text>
          </View>

          <View style={styles.list}>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <InfoCard key={item.id} data={item} type="university" />
              ))
            ) : (
              <Text style={styles.emptyText}>Nenhuma informação encontrada</Text>
            )}
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
