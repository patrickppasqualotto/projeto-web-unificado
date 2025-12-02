import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from './LoginForm';
import { AdminPanel } from './AdminPanel';

const { width } = Dimensions.get('window');

interface UserDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export function UserDrawer({ visible, onClose }: UserDrawerProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const displayName = user?.name || user?.email || '';
  const initials = displayName
    ? displayName
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : '?';

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleAdminPanel = () => {
    setShowAdminPanel(true);
  };

  const handleBackToProfile = () => {
    setShowAdminPanel(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.drawer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {showAdminPanel && (
                <TouchableOpacity onPress={handleBackToProfile} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="#030213" />
                </TouchableOpacity>
              )}
              <Text style={styles.headerTitle}>
                {!isAuthenticated
                  ? 'Login'
                  : showAdminPanel
                  ? 'Painel Administrativo'
                  : 'Perfil'}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#717182" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {!isAuthenticated ? (
              <LoginForm onSuccess={onClose} />
            ) : showAdminPanel ? (
              <AdminPanel onBack={handleBackToProfile} />
            ) : (
              <View style={styles.profileContent}>
                {/* User Info */}
                <View style={styles.userInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials}</Text>
                  </View>
                  <Text style={styles.userName}>{user?.name || user?.email}</Text>
                  <Text style={styles.userEmail}>{user?.email}</Text>
                  {user?.department && (
                    <View style={styles.departmentBadge}>
                      <Text style={styles.departmentText}>{user.department}</Text>
                    </View>
                  )}
                    {user?.id_perfil === 2 && (
                    <View style={styles.adminBadge}>
                      <Text style={styles.adminBadgeText}>Administrador</Text>
                    </View>
                  )}
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    {user?.id_perfil === 2 && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={handleAdminPanel}
                    >
                      <Ionicons name="settings" size={20} color="#030213" />
                      <Text style={styles.actionButtonText}>Painel Administrativo</Text>
                      <Ionicons name="chevron-forward" size={20} color="#717182" />
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
                    <Ionicons name="person" size={20} color="#030213" />
                    <Text style={styles.actionButtonText}>Meu Perfil</Text>
                    <Ionicons name="chevron-forward" size={20} color="#717182" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton} onPress={() => {}}>
                    <Ionicons name="bookmark" size={20} color="#030213" />
                    <Text style={styles.actionButtonText}>Salvos</Text>
                    <Ionicons name="chevron-forward" size={20} color="#717182" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.logoutButton]}
                    onPress={handleLogout}
                  >
                    <Ionicons name="log-out" size={20} color="#d4183d" />
                    <Text style={[styles.actionButtonText, styles.logoutText]}>
                      Sair
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  drawer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ececf0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#030213',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  profileContent: {
    padding: 16,
  },
  userInfo: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#ececf0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#030213',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#030213',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#717182',
    marginBottom: 8,
  },
  departmentBadge: {
    backgroundColor: '#e9ebef',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  departmentText: {
    fontSize: 12,
    color: '#030213',
    fontWeight: '500',
  },
  adminBadge: {
    backgroundColor: '#030213',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  adminBadgeText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  actions: {
    marginTop: 16,
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f3f3f5',
    borderRadius: 12,
    gap: 12,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#030213',
    fontWeight: '500',
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d4183d',
    marginTop: 8,
  },
  logoutText: {
    color: '#d4183d',
  },
});
