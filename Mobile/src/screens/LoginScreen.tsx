import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { LoginScreenNavigationProp } from '../types/navigation';

interface Props {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.error || 'Invalid credential');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to StudyBuddy AI</Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#F9FAFB' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: '#4F46E5', borderRadius: 10, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  linkText: { color: '#4F46E5', textAlign: 'center', marginTop: 20, fontSize: 14, fontWeight: '500' },
});
