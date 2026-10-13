import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'expo-router';
import { CustomInput } from '../components/CustomInput';
import { GradientButton } from '../components/GradientButton';
import { AuthHeader } from '../components/AuthHeader';
import Checkbox from 'expo-checkbox';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '../validation/schemas';

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Login Failed', error.response?.data?.error || 'Invalid credential');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AuthHeader subtitle="Your AI-Powered Academic Assistant" />

        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                icon="mail"
                placeholder="your@email.com"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                autoCapitalize="none"
                keyboardType="email-address"
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                icon="lock"
                placeholder="Password"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                isPassword
                secureTextEntry={!showPassword}
                onToggleSecure={() => setShowPassword(!showPassword)}
                error={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="rememberMe"
            render={({ field: { onChange, value } }) => (
              <View style={styles.optionsContainer}>
                <Checkbox
                  value={value}
                  onValueChange={onChange}
                  color={value ? '#3B82F6' : undefined}
                  style={styles.checkbox}
                />
                <Text style={styles.checkboxText}>Remember me</Text>
              </View>
            )}
          />

          <GradientButton title="Sign In" onPress={handleSubmit(onSubmit)} isSubmitting={isSubmitting} />
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.footerText}>Don't have an account? <Text style={styles.footerLink}>Sign Up</Text></Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
