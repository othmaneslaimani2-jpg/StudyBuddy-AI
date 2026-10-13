import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface StatCardProps {
  title: string;
  count: string | number;
  sub: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  bg: string;
  iconBg: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  count,
  sub,
  icon,
  color,
  bg,
  iconBg,
}) => {
  return (
    <View style={[styles.statCard, { backgroundColor: bg }]}>
      <View style={[styles.statIconBox, { backgroundColor: iconBg }]}>
        <Feather name={icon} size={20} color={color} />
      </View>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statCount}>{count}</Text>
      <View style={styles.statFooter}>
        <Text style={styles.statSub}>{sub}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    justifyContent: 'space-between',
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
    marginBottom: 4,
  },
  statCount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  statFooter: {
    marginTop: 6,
  },
  statSub: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
});
