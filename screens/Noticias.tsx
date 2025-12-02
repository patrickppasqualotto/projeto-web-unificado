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
import { useNoticias } from '../hooks/useNoticias';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export function NewsScreen() {
  const { noticias, loading, error, refetch } = useNoticias();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => ['Conquistas', 'Oportunidades', 'Comunidade', 'Eventos'],
    []
  );

  const filteredData = useMemo(() => {
    return noticias.map((noticia) => ({
      id: noticia.id_noticia,
      title: noticia.titulo,
      category: 'Notícia',
      content: noticia.conteudo,
      author: noticia.Usuario?.nome || 'Desconhecido',
      date: new Date(noticia.data_publicacao).toLocaleDateString('pt-BR'),
      link: noticia.imagem_url || '#',
    }));
  }, [noticias]);

  const clearFilters = () => {
    setSelectedCategory(null);
  };

  if (loading)
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#030213" />
        <Text style={styles.loadingText}>Carregando notícias...</Text>
      </View>
    );

  if (error)
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Erro ao carregar notícias</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );

  if (filteredData.length === 0)
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>Nenhuma notícia encontrada</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.description}>
            Notícias institucionais, pesquisas, eventos e conquistas da comunidade universitária
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

            {selectedCategory && (
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
            {filteredData.map((item) => (
              <InfoCard key={item.id} data={item} type="news" />
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
