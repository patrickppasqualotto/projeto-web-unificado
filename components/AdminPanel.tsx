import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CreateForms } from './CreateForms';

interface AdminPanelProps {
  onBack: () => void;
}

type ContentType =
  | 'university'
  | 'news'
  | 'opportunity'
  | 'internship'
  | 'event'
  | null;

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [selectedForm, setSelectedForm] = useState<ContentType>(null);

  if (selectedForm) {
    return (
      <CreateForms
        type={selectedForm}
        onBack={() => setSelectedForm(null)}
        onSuccess={() => setSelectedForm(null)}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Ionicons name="newspaper" size={24} color="#030213" />
          <Text style={styles.statNumber}>156</Text>
          <Text style={styles.statLabel}>Notícias</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="briefcase" size={24} color="#030213" />
          <Text style={styles.statNumber}>89</Text>
          <Text style={styles.statLabel}>Estágios</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="calendar" size={24} color="#030213" />
          <Text style={styles.statNumber}>34</Text>
          <Text style={styles.statLabel}>Eventos</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trophy" size={24} color="#030213" />
          <Text style={styles.statNumber}>67</Text>
          <Text style={styles.statLabel}>Oportunidades</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cadastrar Conteúdo</Text>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setSelectedForm('university')}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="school" size={28} color="#030213" />
            </View>
            <Text style={styles.actionTitle}>Informação Institucional</Text>
            <Text style={styles.actionDescription}>
              Adicionar informação da universidade
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setSelectedForm('news')}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="newspaper" size={28} color="#030213" />
            </View>
            <Text style={styles.actionTitle}>Notícia</Text>
            <Text style={styles.actionDescription}>
              Publicar nova notícia institucional
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setSelectedForm('opportunity')}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="trophy" size={28} color="#030213" />
            </View>
            <Text style={styles.actionTitle}>Oportunidade Acadêmica</Text>
            <Text style={styles.actionDescription}>
              Adicionar bolsa, intercâmbio ou competição
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setSelectedForm('internship')}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="briefcase" size={28} color="#030213" />
            </View>
            <Text style={styles.actionTitle}>Vaga de Estágio</Text>
            <Text style={styles.actionDescription}>
              Cadastrar nova vaga de estágio
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setSelectedForm('event')}
          >
            <View style={styles.actionIconContainer}>
              <Ionicons name="calendar" size={28} color="#030213" />
            </View>
            <Text style={styles.actionTitle}>Evento</Text>
            <Text style={styles.actionDescription}>
              Criar novo evento universitário
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f3f3f5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: '#030213',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#717182',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#030213',
    marginBottom: 16,
  },
  actions: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ececf0',
    padding: 16,
    borderRadius: 12,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#f3f3f5',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#030213',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: '#717182',
  },
});
