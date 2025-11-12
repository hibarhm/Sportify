// app/login.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();

  return (
    <View style={styles.container}>
        <View style={{ height: 60 }} />
      {/* BACK ARROW + TITLE */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(main)')}>
          <Feather name="arrow-left" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Login</Text>
        <View style={{ width: 28 }} />
      </View>

      <Image source={require('../assets/images/icon.png')} style={styles.logo} />

      <Text style={styles.label}>Email</Text>
      <View style={styles.inputContainer}>
        <TextInput placeholder="Enter your email" style={styles.input} keyboardType="email-address" autoCapitalize="none" />
      </View>

      <Text style={styles.label}>Password</Text>
      <View style={styles.inputContainer}>
        <TextInput placeholder="Enter your password" style={styles.input} secureTextEntry />
      </View>

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/register')}>
        <Text style={styles.registerText}>
          Don't have an account? <Text style={styles.registerLink}>Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold' },
  logo: { width: 80, height: 80, alignSelf: 'center', marginBottom: 50, borderRadius: 20 },
  label: { fontSize: 16, color: '#333', marginBottom: 8, fontWeight: '600' },
  inputContainer: { backgroundColor: '#f5f5f5', borderRadius: 12, paddingHorizontal: 20, marginBottom: 20 },
  input: { height: 50, fontSize: 16, color: '#333' },
  loginButton: { backgroundColor: '#007AFF', paddingVertical: 16, borderRadius: 30, alignItems: 'center', marginTop: 20 },
  loginText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  forgotText: { color: '#007AFF', textAlign: 'center', marginTop: 20, fontSize: 15 },
  registerText: { textAlign: 'center', marginTop: 30, color: '#666', fontSize: 15 },
  registerLink: { color: '#007AFF', fontWeight: 'bold' },
});