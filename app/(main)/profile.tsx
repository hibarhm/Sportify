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
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const { theme, colors, toggleTheme } = useTheme();

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
            router.replace('/splash'); // Go to splash after logout
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 12 }}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.text }}>No user data found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={[styles.header, { backgroundColor: colors.header }]}> 
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        </View>

        {/* USER CARD */}
        <View style={[styles.userCard, { backgroundColor: colors.card, shadowColor: colors.border }]}> 
          <View style={styles.avatarContainer}>
            <Image
             source={{ uri: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email || user.name}` }}
              style={[styles.avatar, { borderColor: colors.primary }]}
            />
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{user.name || 'User'}</Text>
          <Text style={[styles.handle, { color: colors.textSecondary }]}>@{user.username || user.email?.split('@')[0]}</Text>
          <Text style={[styles.bio, { color: colors.textSecondary }]}> {user.bio || 'Staying active and crushing goals. Let\'s make every workout count!'} </Text>
          <TouchableOpacity style={[styles.editButton, { backgroundColor: colors.input }]}> 
            <Text style={[styles.editText, { color: colors.textSecondary }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* ACCOUNT INFO */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.border }]}> 
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account Information</Text>
          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}> 
            <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
            <Text style={[styles.value, { color: colors.text }]}>{user.email || 'Not set'}</Text>
          </View>
          <View style={[styles.infoRow, { borderBottomColor: colors.border }]}> 
            <Text style={[styles.label, { color: colors.textSecondary }]}>Username</Text>
            <Text style={[styles.value, { color: colors.text }]}>@{user.username || user.email?.split('@')[0]}</Text>
          </View>
          <TouchableOpacity style={styles.changePassword}>
            <Text style={[styles.changePasswordText, { color: colors.primary }]}>Change Password</Text>
          </TouchableOpacity>
        </View>

        {/* APP SETTINGS */}
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: colors.border }]}> 
          <Text style={[styles.sectionTitle, { color: colors.text }]}>App Settings</Text>
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}> 
            <Feather name="moon" size={22} color={colors.icon} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              thumbColor={theme === 'dark' ? colors.primary : '#f4f3f4'}
              trackColor={{ false: '#767577', true: colors.primary }}
            />
          </View>
          <View style={[styles.settingRow, { borderBottomColor: colors.border }]}> 
            <View style={styles.settingLabel}>
              <Feather name="bell" size={20} color={colors.icon} />
              <Text style={[styles.settingText, { color: colors.text }]}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#ddd', true: colors.primary }}
              thumbColor={notifications ? colors.card : '#f4f4f4'}
            />
          </View>
        </View>

        {/* LOG OUT BUTTON */}
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]} onPress={handleLogout}>
          <Feather name="log-out" size={20} color={colors.card} />
          <Text style={[styles.logoutText, { color: colors.card }]}>Log Out</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Keep all your beautiful styles
const styles = StyleSheet.create({
  container: { flex: 1 }, // removed hardcoded backgroundColor
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold' }, // removed hardcoded color
  saveText: { fontSize: 17, color: '#007AFF', fontWeight: '600' },
  userCard: { marginHorizontal: 20, marginTop: 20, borderRadius: 20, paddingVertical: 30, alignItems: 'center', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 5 },
  avatarContainer: { marginBottom: 16 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3 },
  name: { fontSize: 26, fontWeight: 'bold', marginBottom: 4 },
  handle: { fontSize: 16, marginBottom: 12 },
  bio: { fontSize: 15, textAlign: 'center', paddingHorizontal: 30, lineHeight: 22, marginBottom: 20 },
  editButton: { paddingHorizontal: 32, paddingVertical: 12, borderRadius: 25 },
  editText: { fontSize: 15, fontWeight: '600' },
  section: { marginHorizontal: 20, marginTop: 24, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 16, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 5 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1 },
  label: { fontSize: 15 },
  value: { fontSize: 15, fontWeight: '500' },
  changePassword: { marginTop: 12 },
  changePasswordText: { fontSize: 15, fontWeight: '600' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
  settingLabel: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingText: { fontSize: 16 },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, marginTop: 30, paddingVertical: 16, borderRadius: 30, gap: 10, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8 },
  logoutText: { fontSize: 17, fontWeight: 'bold' },
});