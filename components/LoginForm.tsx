import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormProps {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        onSuccess();
      } else {
        Alert.alert('Erro', 'Email ou senha inválidos');
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="school" size={48} color="#030213" />
      </View>

      <Text style={styles.title}>Portal Universitário</Text>
      <Text style={styles.subtitle}>Faça login para acessar seu perfil</Text>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="seu.email@universidade.edu.br"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#717182"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.testAccounts}>
        <Text style={styles.testAccountsTitle}>Contas de teste:</Text>
        <Text style={styles.testAccountText}>
          Admin: admin@universidade.edu.br / admin123
        </Text>
        <Text style={styles.testAccountText}>
          Usuário: joao@universidade.edu.br / user123
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#030213',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#717182',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#030213',
  },
  input: {
    backgroundColor: '#f3f3f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#030213',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 48,
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
    top: 12,
    padding: 4,
  },
  button: {
    backgroundColor: '#030213',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  testAccounts: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#f3f3f5',
    borderRadius: 8,
  },
  testAccountsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#030213',
    marginBottom: 8,
  },
  testAccountText: {
    fontSize: 11,
    color: '#717182',
    marginBottom: 4,
  },
});
