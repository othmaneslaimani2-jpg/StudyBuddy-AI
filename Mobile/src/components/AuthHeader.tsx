import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface AuthHeaderProps {
  subtitle: string;
}

export const AuthHeader = ({ subtitle }: AuthHeaderProps) => (
  <View style={styles.container}>
    <View style={styles.headerIllustrationPlaceholder}>
      <Image 
        source={require('../../assets/logoheader.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
    </View>

    <View style={styles.titleContainer}>
      <Text style={styles.brandTitle}>
        StudyBuddy <Text style={styles.brandTitleAI}>AI</Text>
      </Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.tagline}>Study smarter  •  Take better notes  •  Get things done</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  headerIllustrationPlaceholder: {
    height: 180, 
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  brandTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#000000',
    marginBottom: 4,
    letterSpacing: -1,
  },
  brandTitleAI: {
    color: '#6344FF',
  },
  subtitle: {
    fontSize: 20,
    color: '#111827',
    fontWeight: '500',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '400',
  },
});
