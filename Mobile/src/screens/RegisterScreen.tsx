import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { RegisterScreenNavigationProp } from '../types/navigation';
import Checkbox from 'expo-checkbox';
import { CustomInput } from '../components/CustomInput';
import { GradientButton } from '../components/GradientButton';
import { AuthHeader } from '../components/AuthHeader';

interface Props {
  navigation: RegisterScreenNavigationProp;
}

export default function RegisterScreen({ navigation }: Props) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useContext(AuthContext);

  const updateForm = (key: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleRegister = async () => {
    const { name, email, password, confirmPassword } = form;
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Validation Error', 'Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return;
    }
    if (!agree) {
      Alert.alert('Validation Error', 'Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(name, email, password);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.error || 'Failed to create account');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <AuthHeader subtitle="Create your account" />

        <View style={styles.formContainer}>
          <CustomInput 
            icon="user" 
            placeholder="Full Name" 
            value={form.name} 
            onChangeText={(t) => updateForm('name', t)} 
          />
          <CustomInput 
            icon="mail" 
            placeholder="your@email.com" 
            value={form.email} 
            onChangeText={(t) => updateForm('email', t)} 
            autoCapitalize="none" 
            keyboardType="email-address" 
          />
          <CustomInput 
            icon="lock" 
            placeholder="Password" 
            value={form.password} 
            onChangeText={(t) => updateForm('password', t)} 
            isPassword 
            secureTextEntry={!showPassword} 
            onToggleSecure={() => setShowPassword(!showPassword)} 
          />
          <CustomInput 
            icon="lock" 
            placeholder="Confirm Password" 
            value={form.confirmPassword} 
            onChangeText={(t) => updateForm('confirmPassword', t)} 
            isPassword 
            secureTextEntry={!showConfirmPassword} 
            onToggleSecure={() => setShowConfirmPassword(!showConfirmPassword)} 
          />

          <View style={styles.checkboxContainer}>
            <Checkbox
              value={agree}
              onValueChange={setAgree}
              color={agree ? '#3B82F6' : undefined}
              style={styles.checkbox}
            />
            <Text style={styles.checkboxText}>
              I agree to the <Text style={styles.linkTextInline}>Terms of Service</Text> and <Text style={styles.linkTextInline}>Privacy Policy</Text>
            </Text>
          </View>

          <GradientButton 
            title="Create Account" 
            onPress={handleRegister} 
            isSubmitting={isSubmitting} 
          />
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerText}>
              Already have an account? <Text style={styles.footerLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  formContainer: {
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 4,
    paddingRight: 20,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    marginRight: 12,
  },
  checkboxText: {
    fontSize: 13,
    color: '#111827',
  },
  linkTextInline: {
    color: '#2563EB',
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  footerLink: {
    color: '#2563EB',
    fontWeight: '600',
  },
});
