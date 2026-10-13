import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CustomInputProps extends TextInputProps {
  icon: keyof typeof Feather.glyphMap;
  isPassword?: boolean;
  onToggleSecure?: () => void;
  error?: string;
}

export const CustomInput = ({ icon, isPassword, onToggleSecure, error, ...rest }: CustomInputProps) => (
  <View style={styles.container}>
    <View style={[styles.inputWrapper, !!error && styles.inputWrapperError]}>
      <Feather name={icon} size={20} color={error ? "#EF4444" : "#4B5563"} style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholderTextColor="#9CA3AF"
        {...rest}
      />
      {isPassword && (
        <TouchableOpacity onPress={onToggleSecure} style={styles.eyeIcon}>
          <Feather name={rest.secureTextEntry ? "eye-off" : "eye"} size={20} color="#4B5563" />
        </TouchableOpacity>
      )}
    </View>
    {!!error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAF0F6',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
  },
  inputWrapperError: {
    borderColor: '#EF4444',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    height: '100%',
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

