// app/profile.tsx  ← FULLY DYNAMIC + REAL USER DATA
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(true);

  // Load user from AsyncStorage when screen opens
  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        Alert.alert('Error', 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('user');
            router.replace('/splash'); // Back to start
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa', justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa', justifyContent: 'center', alignItems: 'center' }}>
        <Text>No user data found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* USER CARD */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Image
             source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || user.name}` }}
              style={styles.avatar}
              //defaultSource={require('../assets/images/icon.png')} // fallback
            />
          </View>
          <Text style={styles.name}>{user.name || 'User'}</Text>
          <Text style={styles.handle}>@{user.username || user.email?.split('@')[0]}</Text>
          <Text style={styles.bio}>
            {user.bio || 'Staying active and crushing goals. Let\'s make every workout count!'}
          </Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ACCOUNT INFO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email || 'Not set'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Username</Text>
            <Text style={styles.value}>@{user.username || user.email?.split('@')[0]}</Text>
          </View>
          <TouchableOpacity style={styles.changePassword}>
            <Text style={styles.changePasswordText}>Change Password</Text>
          </TouchableOpacity>
        </View>

        {/* APP SETTINGS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingLabel}>
              <Feather name="moon" size={20} color="#666" />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
              thumbColor={darkMode ? '#fff' : '#f4f4f4'}
            />
          </View>
          <View style={styles.settingRow}>
            <View style={styles.settingLabel}>
              <Feather name="bell" size={20} color="#666" />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
              thumbColor={notifications ? '#fff' : '#f4f4f4'}
            />
          </View>
        </View>

        {/* LOG OUT BUTTON */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color="#fff" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Keep all your beautiful styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000' },
  saveText: { fontSize: 17, color: '#007AFF', fontWeight: '600' },
  userCard: { backgroundColor: '#fff', marginHorizontal: 20, marginTop: 20, borderRadius: 20, paddingVertical: 30, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 5 },
  avatarContainer: { marginBottom: 16 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: '#f0e6ff' },
  name: { fontSize: 26, fontWeight: 'bold', color: '#000', marginBottom: 4 },
  handle: { fontSize: 16, color: '#666', marginBottom: 12 },
  bio: { fontSize: 15, color: '#444', textAlign: 'center', paddingHorizontal: 30, lineHeight: 22, marginBottom: 20 },
  editButton: { backgroundColor: '#f0f0f0', paddingHorizontal: 32, paddingVertical: 12, borderRadius: 25 },
  editText: { fontSize: 15, color: '#666', fontWeight: '600' },
  section: { backgroundColor: '#fff', marginHorizontal: 20, marginTop: 24, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#eee' },
  label: { fontSize: 15, color: '#666' },
  value: { fontSize: 15, color: '#000', fontWeight: '500' },
  changePassword: { marginTop: 12 },
  changePasswordText: { fontSize: 15, color: '#007AFF', fontWeight: '600' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  settingLabel: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingText: { fontSize: 16, color: '#000' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#007AFF', marginHorizontal: 20, marginTop: 30, paddingVertical: 16, borderRadius: 30, gap: 10, shadowColor: '#007AFF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  logoutText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});