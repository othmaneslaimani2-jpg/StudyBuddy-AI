import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface FieldHeaderProps {
  icon: keyof typeof Feather.glyphMap;
  color: string;
  bg: string;
  label: string;
  opt?: boolean;
}

export const FieldHeader: React.FC<FieldHeaderProps> = ({
  icon,
  color,
  bg,
  label,
  opt,
}) => (
  <View style={styles.fieldHeader}>
    <View style={[styles.iconBox, { backgroundColor: bg }]}>
      <Feather name={icon} size={16} color={color} />
    </View>
    <Text style={styles.fieldLabel}>
      {label}{' '}
      {opt && <Text style={styles.optText}>(Optional)</Text>}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  optText: {
    color: '#9CA3AF',
    fontWeight: 'normal',
    fontSize: 13,
  },
});
