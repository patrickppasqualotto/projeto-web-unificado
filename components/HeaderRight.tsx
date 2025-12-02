import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { UserDrawer } from './UserDrawer';

export function HeaderRight() {
  const { isAuthenticated } = useAuth();
  const [drawerVisible, setDrawerVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setDrawerVisible(true)}
      >
        <Ionicons
          name={isAuthenticated ? 'person-circle' : 'person-circle-outline'}
          size={28}
          color="#fff"
        />
      </TouchableOpacity>
      <UserDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: 12,
    padding: 4,
  },
});
