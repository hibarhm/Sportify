// app/splash.tsx   ← Keep your beautiful design, just change the timer
import { View, Text, Image, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './context/ThemeContext';

export default function Splash() {
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        if (user) {
          router.replace('/(main)');
        } else {
          router.replace('/register');
        }
      } catch (e) {
        router.replace('/register');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={require('../assets/images/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={[styles.title, { color: colors.primary }]}>SPORTIFY</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 24,
    marginBottom: 30,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    letterSpacing: 4,
  },
});