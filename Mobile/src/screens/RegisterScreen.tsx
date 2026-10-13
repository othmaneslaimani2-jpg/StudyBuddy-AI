import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'expo-router';
import Checkbox from 'expo-checkbox';
import { CustomInput } from '../components/CustomInput';
import { GradientButton } from '../components/GradientButton';
import { AuthHeader } from '../components/AuthHeader';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormData } from '../validation/schemas';

export default function RegisterScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const register = useAuthStore((state) => state.register);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agree: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data.name, data.email, data.password);
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.response?.data?.error || 'Failed to create account');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <AuthHeader subtitle="Create your account" />

        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                icon="user"
                placeholder="Full Name"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                error={errors.name?.message}
              />
            )}
          />

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
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                icon="lock"
                placeholder="Confirm Password"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                isPassword
                secureTextEntry={!showConfirmPassword}
                onToggleSecure={() => setShowConfirmPassword(!showConfirmPassword)}
                error={errors.confirmPassword?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="agree"
            render={({ field: { onChange, value } }) => (
              <View style={styles.checkboxWrapper}>
                <View style={styles.checkboxContainer}>
                  <Checkbox
                    value={value}
                    onValueChange={onChange}
                    color={value ? '#3B82F6' : undefined}
                    style={styles.checkbox}
                  />
                  <Text style={styles.checkboxText}>
                    I agree to the <Text style={styles.linkTextInline}>Terms of Service</Text> and{' '}
                    <Text style={styles.linkTextInline}>Privacy Policy</Text>
                  </Text>
                </View>
                {errors.agree && <Text style={styles.errorText}>{errors.agree.message}</Text>}
              </View>
            )}
          />

          <GradientButton
            title="Create Account"
            onPress={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
          />
        </View>

        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.footerText}>
              Already have an account? <Text style={styles.footerLink}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  checkboxWrapper: {
    marginBottom: 20,
    marginTop: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#4B5563',
    lineHeight: 18,
    flex: 1,
  },
  linkTextInline: {
    color: '#2563EB',
    fontWeight: '500',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
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
