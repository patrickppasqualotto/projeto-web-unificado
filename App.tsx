import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from './contexts/AuthContext';
import { UniversityInfoScreen } from './screens/Informacoes';
import { NewsScreen } from './screens/Noticias';
import { AcademicOpportunitiesScreen } from './screens/OportunidadesAcademicas';
import { InternshipsScreen } from './screens/Estagios';
import { EventsScreen } from './screens/Eventos';
import { HeaderRight } from './components/HeaderRight';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Tab.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: '#030213',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: '600',
                fontSize: 18,
              },
              tabBarActiveTintColor: '#030213',
              tabBarInactiveTintColor: '#717182',
              tabBarLabelStyle: {
                fontSize: 10,
                fontWeight: '500',
              },
              tabBarStyle: {
                paddingBottom: 4,
                paddingTop: 4,
                height: 60,
              },
              headerRight: () => <HeaderRight />,
            }}
          >
            <Tab.Screen
              name="Universidade"
              component={UniversityInfoScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="school" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Notícias"
              component={NewsScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="newspaper" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Oportunidades"
              component={AcademicOpportunitiesScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="trophy" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Estágios"
              component={InternshipsScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="briefcase" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Eventos"
              component={EventsScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="calendar" size={size} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
