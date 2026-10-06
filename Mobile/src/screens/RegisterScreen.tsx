import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { RegisterScreenNavigationProp } from '../types/navigation';

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    try {
      await register(name, email, password);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.error || 'Failed to create account');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account 🚀</Text>
      <Text style={styles.subtitle}>Join StudyBuddy AI today</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
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

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already have an account? Log In</Text>
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
