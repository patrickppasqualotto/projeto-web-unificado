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
import { useVagas } from '../hooks/useVagas';

export function InternshipsScreen() {
  const { vagas, loading, error, refetch } = useVagas();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedModality, setSelectedModality] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  const modalities = useMemo(
    () => ['Presencial', 'Remoto', 'Híbrido'],
    []
  );

  const departments = useMemo(
    () => ['Tecnologia', 'Administração', 'Contabilidade', 'Suporte Técnico', 'Estágio'],
    []
  );

  const filteredData = useMemo(() => {
    return vagas.map((vaga) => ({
      id: vaga.id_vaga,
      title: vaga.titulo,
      modality: vaga.Categoria_vaga?.nome || 'Estágio',
      company: vaga.nome_empresa || 'Empresa não informada',
      description: vaga.descricao,
      location: vaga.localizacao || 'Não especificado',
      department: vaga.Categoria_vaga?.nome || 'Não especificado',
      salary: vaga.salario ? `R$ ${Number(vaga.salario).toFixed(2)}` : 'A combinar',
      workload: 'A definir',
      link: vaga.url || '#',
    }));
  }, [vagas]);

  const clearFilters = () => {
    setSelectedModality(null);
    setSelectedDepartment(null);
  };

  const hasActiveFilters = selectedModality || selectedDepartment;

  if (loading)
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#030213" />
        <Text style={styles.loadingText}>Carregando estágios...</Text>
      </View>
    );

  if (error)
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Erro ao carregar estágios</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );

  if (filteredData.length === 0)
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>Nenhum estágio encontrado</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.description}>
            Vagas de estágio em empresas parceiras e oportunidades profissionais para estudantes
          </Text>

          <FilterSection
            visible={showFilters}
            onToggle={() => setShowFilters(!showFilters)}
          >
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Modalidade</Text>
              <View style={styles.filterOptions}>
                {modalities.map((modality) => (
                  <TouchableOpacity
                    key={modality}
                    style={[
                      styles.filterChip,
                      selectedModality === modality && styles.filterChipActive,
                    ]}
                    onPress={() =>
                      setSelectedModality(
                        selectedModality === modality ? null : modality
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedModality === modality &&
                          styles.filterChipTextActive,
                      ]}
                    >
                      {modality}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Área</Text>
              <View style={styles.filterOptions}>
                {departments.map((dept) => (
                  <TouchableOpacity
                    key={dept}
                    style={[
                      styles.filterChip,
                      selectedDepartment === dept && styles.filterChipActive,
                    ]}
                    onPress={() =>
                      setSelectedDepartment(
                        selectedDepartment === dept ? null : dept
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedDepartment === dept &&
                          styles.filterChipTextActive,
                      ]}
                    >
                      {dept}
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
              {filteredData.length === 1 ? 'vaga disponível' : 'vagas disponíveis'}
            </Text>
          </View>

          <View style={styles.list}>
            {filteredData.map((item) => (
              <InfoCard key={item.id} data={item} type="internship" />
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
