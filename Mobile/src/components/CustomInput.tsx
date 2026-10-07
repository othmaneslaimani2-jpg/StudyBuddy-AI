import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface CustomInputProps extends TextInputProps {
  icon: keyof typeof Feather.glyphMap;
  isPassword?: boolean;
  onToggleSecure?: () => void;
}

export const CustomInput = ({ icon, isPassword, onToggleSecure, ...rest }: CustomInputProps) => (
  <View style={styles.inputWrapper}>
    <Feather name={icon} size={20} color="#4B5563" style={styles.inputIcon} />
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
);

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAF0F6',
    borderRadius: 14,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
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
});
