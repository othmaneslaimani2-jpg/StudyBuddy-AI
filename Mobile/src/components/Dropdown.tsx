import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface DropdownProps {
  icon: keyof typeof Feather.glyphMap;
  value: string;
  onPress: () => void;
}

export const Dropdown: React.FC<DropdownProps> = ({ icon, value, onPress }) => (
  <TouchableOpacity style={styles.dropdown} onPress={onPress} activeOpacity={0.7}>
    <Feather name={icon} size={16} color="#111827" />
    <Text style={styles.dropdownText}>{value}</Text>
    <Feather name="chevron-down" size={16} color="#6B7280" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  dropdownText: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    marginLeft: 10,
  },
});
