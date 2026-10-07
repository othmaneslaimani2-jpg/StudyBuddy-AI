import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ProfileScreenNavigationProp } from '../types/navigation';

interface Props {
  navigation: ProfileScreenNavigationProp;
}

const STATS = [
  { label: 'Completed Tasks', value: '12', icon: 'checkmark-circle-outline', color: '#10B981' },
  { label: 'Notes Uploaded', value: '5', icon: 'document-text-outline', color: '#3B82F6' },
  { label: 'Study Streak', value: '3 Days', icon: 'flame-outline', color: '#F59E0B' },
];

const MENU_ITEMS = [
  { label: 'About', icon: 'information-circle-outline' },
  { label: 'FAQ', icon: 'help-circle-outline' },
];

export default function ProfileScreen({ navigation }: Props) {
  const [notify, setNotify] = useState(true);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => navigation.replace('Login' as any) }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        { }
        <View style={styles.profileHeader}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.profileImage} />
            <TouchableOpacity style={styles.editImageBtn}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>John Doe</Text>
          <TouchableOpacity style={styles.editProfileBtn}>
            <Text style={styles.editProfileText}>Edit Profile Info</Text>
          </TouchableOpacity>
        </View>

        { }
        <View style={styles.statsContainer}>
          {STATS.map((stat, idx) => (
            <View key={idx} style={styles.statCard}>
              <Ionicons name={stat.icon as any} size={28} color={stat.color} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        { }
        <View style={styles.menuContainer}>
          <View style={styles.menuItem}>
            <View style={styles.menuIconText}>
              <Ionicons name="notifications-outline" size={22} color="#374151" style={styles.menuIcon} />
              <Text style={styles.menuText}>Notifications</Text>
            </View>
            <Switch value={notify} onValueChange={setNotify} trackColor={{ true: '#4F46E5', false: '#D1D5DB' }} />
          </View>

          {MENU_ITEMS.map((item, idx) => (
            <TouchableOpacity key={idx} style={[styles.menuItem, idx === MENU_ITEMS.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.menuIconText}>
                <Ionicons name={item.icon as any} size={22} color="#374151" style={styles.menuIcon} />
                <Text style={styles.menuText}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        { }
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFF' },
  container: { padding: 24, alignItems: 'center' },
  profileHeader: { alignItems: 'center', marginBottom: 30 },
  imageContainer: { position: 'relative', marginBottom: 12 },
  profileImage: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E5E7EB' },
  editImageBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#4F46E5', padding: 8, borderRadius: 20, borderWidth: 2, borderColor: '#FFF' },
  userName: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 8 },
  editProfileBtn: { paddingVertical: 6, paddingHorizontal: 16, backgroundColor: '#EEF2FF', borderRadius: 16 },
  editProfileText: { color: '#4F46E5', fontSize: 13, fontWeight: '600' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 30 },
  statCard: { width: '31%', backgroundColor: '#FFF', padding: 12, borderRadius: 16, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  statValue: { fontSize: 16, fontWeight: '700', color: '#111827', marginTop: 8 },
  statLabel: { fontSize: 11, color: '#6B7280', textAlign: 'center', marginTop: 4 },
  menuContainer: { width: '100%', backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 16, marginBottom: 30, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  menuIconText: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: { marginRight: 12 },
  menuText: { fontSize: 15, color: '#374151', fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingVertical: 16, backgroundColor: '#FEF2F2', borderRadius: 16 },
  logoutIcon: { marginRight: 8 },
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '600' }
});
