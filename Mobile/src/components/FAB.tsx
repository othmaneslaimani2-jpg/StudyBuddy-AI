import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface FABProps {
  icon?: keyof typeof Feather.glyphMap;
  size?: number;
  color?: string;
  backgroundColor?: string;
  onPress: () => void;
}

export const FAB: React.FC<FABProps> = ({
  icon = 'plus',
  size = 24,
  color = '#FFF',
  backgroundColor = '#4F46E5',
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.fab, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Feather name={icon} size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
