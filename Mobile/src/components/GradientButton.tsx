import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

interface GradientButtonProps extends TouchableOpacityProps {
  title: string;
  isSubmitting?: boolean;
}

export const GradientButton = ({ title, isSubmitting = false, ...rest }: GradientButtonProps) => (
  <TouchableOpacity style={styles.buttonContainer} activeOpacity={0.8} disabled={isSubmitting || rest.disabled} {...rest}>
    <LinearGradient
      colors={isSubmitting ? ['#A78BFA', '#8B5CF6'] : ['#5042FA', '#4435EE']}
      style={styles.buttonGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      {isSubmitting ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <>
          <Text style={styles.buttonText}>{title}</Text>
          <Feather name="arrow-right" size={20} color="#FFF" style={styles.buttonArrow} />
        </>
      )}
    </LinearGradient>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  buttonContainer: {
    width: '100%',
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    height: 60,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonArrow: {
    position: 'absolute',
    right: 24,
  },
});
