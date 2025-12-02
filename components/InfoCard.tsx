import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InfoCardProps {
  data: any;
  type: 'university' | 'news' | 'opportunity' | 'internship' | 'event';
}

export function InfoCard({ data, type }: InfoCardProps) {
  const handleLinkPress = (url: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const renderUniversityCard = () => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{data.title}</Text>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{data.category}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.description}>{data.description}</Text>
      {(data.endereco || data.telefone || data.email) && (
        <View style={styles.infoRow}>
          {data.endereco && (
            <View style={styles.meta}>
              <Ionicons name="location" size={14} color="#717182" />
              <Text style={styles.metaText}>{data.endereco}</Text>
            </View>
          )}
          {data.telefone && (
            <View style={styles.meta}>
              <Ionicons name="call" size={14} color="#717182" />
              <Text style={styles.metaText}>{data.telefone}</Text>
            </View>
          )}
          {data.email && (
            <View style={styles.meta}>
              <Ionicons name="mail" size={14} color="#717182" />
              <Text style={styles.metaText}>{data.email}</Text>
            </View>
          )}
        </View>
      )}
      <View style={styles.footer}>
        <View style={styles.meta}>
          <Ionicons name="business" size={14} color="#717182" />
          <Text style={styles.metaText}>{data.department}</Text>
        </View>
        {data.link && (
          <TouchableOpacity onPress={() => handleLinkPress(data.link)}>
            <View style={styles.linkButton}>
              <Ionicons name="link" size={14} color="#030213" />
              <Text style={styles.linkText}>Ver mais</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderNewsCard = () => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{data.title}</Text>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{data.category}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.description} numberOfLines={3}>
        {data.content}
      </Text>
      <View style={styles.footer}>
        <View style={styles.meta}>
          <Ionicons name="person" size={14} color="#717182" />
          <Text style={styles.metaText}>{data.author}</Text>
        </View>
        <View style={styles.meta}>
          <Ionicons name="calendar" size={14} color="#717182" />
          <Text style={styles.metaText}>{data.date}</Text>
        </View>
      </View>
      {data.link && (
        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={() => handleLinkPress(data.link)}
        >
          <Text style={styles.readMoreButtonText}>Ler mais</Text>
          <Ionicons name="arrow-forward" size={16} color="#030213" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderOpportunityCard = () => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{data.title}</Text>
        <View style={styles.badges}>
          <View style={[styles.badge, styles.badgeHighlight]}>
            <Text style={[styles.badgeText, styles.badgeTextHighlight]}>
              {data.type}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.description}>{data.description}</Text>
      <View style={styles.infoRow}>
        <View style={styles.meta}>
          <Ionicons name="business" size={14} color="#717182" />
          <Text style={styles.metaText}>{data.institution}</Text>
        </View>
        <View style={styles.meta}>
          <Ionicons name="time" size={14} color="#717182" />
          <Text style={styles.metaText}>Até {data.deadline}</Text>
        </View>
      </View>
      {data.value && (
        <View style={styles.valueContainer}>
          <Ionicons name="cash" size={16} color="#030213" />
          <Text style={styles.valueText}>{data.value}</Text>
        </View>
      )}
      {data.link && (
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => handleLinkPress(data.link)}
        >
          <Text style={styles.applyButtonText}>Inscrever-se</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderInternshipCard = () => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{data.title}</Text>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{data.modality}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.company}>{data.company}</Text>
      <Text style={styles.description} numberOfLines={3}>
        {data.description}
      </Text>
      <View style={styles.infoRow}>
        <View style={styles.meta}>
          <Ionicons name="location" size={14} color="#717182" />
          <Text style={styles.metaText}>{data.location}</Text>
        </View>
        <View style={styles.meta}>
          <Ionicons name="briefcase" size={14} color="#717182" />
          <Text style={styles.metaText}>{data.department}</Text>
        </View>
      </View>
      <View style={styles.infoRow}>
        <View style={styles.meta}>
          <Ionicons name="cash" size={14} color="#717182" />
          <Text style={styles.metaText}>{data.salary}</Text>
        </View>
        <View style={styles.meta}>
          <Ionicons name="time" size={14} color="#717182" />
          <Text style={styles.metaText}>{data.workload}</Text>
        </View>
      </View>
      {data.link && (
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => handleLinkPress(data.link)}
        >
          <Text style={styles.applyButtonText}>Candidatar-se</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEventCard = () => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{data.title}</Text>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{data.type}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.description}>{data.description}</Text>
      <View style={styles.infoRow}>
        <View style={styles.meta}>
          <Ionicons name="calendar" size={14} color="#717182" />
          <Text style={styles.metaText}>{data.date}</Text>
        </View>
        <View style={styles.meta}>
          <Ionicons name="time" size={14} color="#717182" />
          <Text style={styles.metaText}>{data.time}</Text>
        </View>
      </View>
      <View style={styles.infoRow}>
        <View style={styles.meta}>
          <Ionicons name="location" size={14} color="#717182" />
          <Text style={styles.metaText}>{data.location}</Text>
        </View>
        <View style={styles.meta}>
          <Ionicons name="people" size={14} color="#717182" />
          <Text style={styles.metaText}>{data.organizer}</Text>
        </View>
      </View>
      {data.capacity && (
        <View style={styles.capacityContainer}>
          <Ionicons name="people" size={16} color="#030213" />
          <Text style={styles.capacityText}>{data.capacity} vagas</Text>
        </View>
      )}
      {data.link && (
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => handleLinkPress(data.link)}
        >
          <Text style={styles.applyButtonText}>Inscrever-se</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderMap = {
    university: renderUniversityCard,
    news: renderNewsCard,
    opportunity: renderOpportunityCard,
    internship: renderInternshipCard,
    event: renderEventCard,
  };

  return renderMap[type]();
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ececf0',
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#030213',
    marginBottom: 8,
  },
  company: {
    fontSize: 15,
    fontWeight: '500',
    color: '#030213',
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    backgroundColor: '#f3f3f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeHighlight: {
    backgroundColor: '#030213',
  },
  badgeText: {
    fontSize: 11,
    color: '#717182',
    fontWeight: '500',
  },
  badgeTextHighlight: {
    color: '#fff',
  },
  description: {
    fontSize: 14,
    color: '#717182',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#717182',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    fontSize: 12,
    color: '#030213',
    fontWeight: '500',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f3f3f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  valueText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#030213',
  },
  capacityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f3f3f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  capacityText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#030213',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#030213',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#030213',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  readMoreButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#030213',
  },
});
