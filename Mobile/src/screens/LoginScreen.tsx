import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { LoginScreenNavigationProp } from '../types/navigation';
import { CustomInput } from '../components/CustomInput';
import { GradientButton } from '../components/GradientButton';
import { AuthHeader } from '../components/AuthHeader';
import Checkbox from 'expo-checkbox';

interface Props {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert('Validation Error', 'Please enter email and password');
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.error || 'Invalid credential');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AuthHeader subtitle="Your AI-Powered Academic Assistant" />

        <View style={styles.formContainer}>
          <CustomInput 
            icon="mail" placeholder="your@email.com" value={email} onChangeText={setEmail} 
            autoCapitalize="none" keyboardType="email-address" 
          />
          <CustomInput 
            icon="lock" placeholder="Password" value={password} onChangeText={setPassword} 
            isPassword secureTextEntry={!showPassword} onToggleSecure={() => setShowPassword(!showPassword)} 
          />

          <View style={styles.optionsContainer}>
            <Checkbox value={rememberMe} onValueChange={setRememberMe} color={rememberMe ? '#3B82F6' : undefined} style={styles.checkbox} />
            <Text style={styles.checkboxText}>Remember me</Text>
          </View>

          <GradientButton title="Sign In" onPress={handleLogin} isSubmitting={isSubmitting} />
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerText}>Don't have an account? <Text style={styles.footerLink}>Sign Up</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFCFF' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 28, paddingBottom: 40 },
  formContainer: { width: '100%' },
  optionsContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 28, marginTop: 4 },
  checkbox: { width: 22, height: 22, borderRadius: 5, marginRight: 12 },
  checkboxText: { fontSize: 14, color: '#111827' },
  footerContainer: { alignItems: 'center', marginTop: 'auto', paddingTop: 10 },
  footerText: { fontSize: 14, color: '#6B7280' },
  footerLink: { color: '#2563EB', fontWeight: '600' },
});
