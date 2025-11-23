// app/login.tsx
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './context/ThemeContext';

export default function Login() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in both fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Save user data
        const userData = {
          id: data.id,
          username: data.username,
          email: data.email,
          image: data.image,
          token: data.token,
        };

        await AsyncStorage.setItem('user', JSON.stringify(userData));

        // Success → go to main app (no way back to login)
        router.replace('/(main)'); // Change to '/(tabs)' if your folder is named (tabs)
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid username or password');
      }
    } catch (error) {
      Alert.alert('Error', 'No internet or server down. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}> 
        <View style={{ height: 60 }} />
        {/* TITLE ONLY — NO BACK ARROW */}
        <View style={styles.header}>
          <View style={{ width: 28 }} />
          <Text style={[styles.title, { color: colors.text }]}>Login</Text>
          <View style={{ width: 28 }} />
        </View>
        <Image source={require('../assets/images/icon.png')} style={styles.logo} />
        <Text style={[styles.label, { color: colors.text }]}>Username</Text>
        <View style={[styles.inputContainer, { backgroundColor: colors.input }]}> 
          <TextInput
            placeholder="Enter your username"
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, { color: colors.text }]}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <Text style={[styles.label, { color: colors.text }]}>Password</Text>
        <View style={[styles.inputContainer, { backgroundColor: colors.input }]}> 
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor={colors.textSecondary}
            style={[styles.input, { color: colors.text }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
        {/* LOGIN BUTTON */}
        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: colors.primary }, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={[styles.loginText, { color: colors.card }]}> 
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={[styles.registerText, { color: colors.textSecondary }]}> 
            Don't have an account?{' '}
            <Text style={[styles.registerLink, { color: colors.primary }]}>Register</Text>
          </Text>
        </TouchableOpacity>
        {/* Test Account Hint (Remove before submission if you want) */}
        <View style={{ marginTop: 40, padding: 15, backgroundColor: theme === 'dark' ? '#23242A' : '#f0f8ff', borderRadius: 12 }}>
          <Text style={{ textAlign: 'center', color: colors.primary, fontSize: 13 }}>
            Test Account:{'\n'}
            <Text style={{ fontWeight: 'bold' }}>Username:</Text> kminchelle{'\n'}
            <Text style={{ fontWeight: 'bold' }}>Password:</Text> 0lelplR
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 50,
    borderRadius: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  inputContainer: {
    borderRadius: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    height: 50,
    fontSize: 16,
  },
  loginButton: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 15,
  },
  registerText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 15,
  },
  registerLink: {
    fontWeight: 'bold',
  },
});