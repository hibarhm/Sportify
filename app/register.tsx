// app/register.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Register() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* SPACER FROM TOP */}
      <View style={{ height: 80 }} />

      {/* BACK ARROW + TITLE — MOVED DOWN */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(main)')}>
          <Feather name="arrow-left" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Registration</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* EXTRA SPACE AFTER TITLE */}
      <View style={{ height: 40 }} />

      {/* LOGO — MOVED DOWN */}
      <Image source={require('../assets/images/icon.png')} style={styles.logo} />

      {/* EXTRA SPACE BEFORE FORM */}
      <View style={{ height: 70 }} />

      {/* FORM — MOVED DOWN & SPACED PERFECTLY */}
      <View style={styles.form}>
        <View style={styles.inputWrapper}>
          <Feather name="user" size={20} color="#888" style={styles.inputIcon} />
          <TextInput placeholder="Full Name" style={styles.input} placeholderTextColor="#aaa" />
        </View>

        <View style={styles.inputWrapper}>
          <Feather name="mail" size={20} color="#888" style={styles.inputIcon} />
          <TextInput 
            placeholder="Email Address" 
            style={styles.input} 
            keyboardType="email-address" 
            placeholderTextColor="#aaa" 
          />
        </View>

        <View style={styles.inputWrapper}>
          <Feather name="lock" size={20} color="#888" style={styles.inputIcon} />
          <TextInput placeholder="Password" style={styles.input} secureTextEntry placeholderTextColor="#aaa" />
        </View>

        <View style={styles.inputWrapper}>
          <Feather name="lock" size={20} color="#888" style={styles.inputIcon} />
          <TextInput placeholder="Confirm Password" style={styles.input} secureTextEntry placeholderTextColor="#aaa" />
        </View>

        {/* REGISTER BUTTON — GOES TO PREFERENCES */}
        <TouchableOpacity 
          style={styles.registerButton}
          onPress={() => router.push('/preferences')}
        >
          <Text style={styles.registerText}>Register</Text>
        </TouchableOpacity>

        {/* LOGIN LINK */}
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.loginLinkText}>
            Already have an account? <Text style={styles.loginLink}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    borderRadius: 20,
  },
  form: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  registerButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 24,
  },
  registerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLinkText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#666',
    fontSize: 15,
  },
  loginLink: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});