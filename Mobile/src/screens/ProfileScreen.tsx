import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Switch, Alert, Modal, TextInput } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ProfileScreenNavigationProp } from '../types/navigation';
import apiClient from '../api/client';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  navigation: ProfileScreenNavigationProp;
}



const MENU_ITEMS = [
  { label: 'About', icon: 'information-circle-outline' },
  { label: 'FAQ', icon: 'help-circle-outline' },
];

export default function ProfileScreen({ navigation }: Props) {
  const { user, logout, updateUser } = useContext(AuthContext);
  const [notify, setNotify] = useState(true);
  const [completedTasksCount, setCompletedTasksCount] = useState(0);
  const [notesCount, setNotesCount] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(user?.fullName || '');

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      loadProfileImage();
    }, [])
  );

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedImage) setProfileImage(savedImage);
    } catch (err) {
      console.log('Failed to load profile image', err);
    }
  };

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setProfileImage(uri);
        await AsyncStorage.setItem('profileImage', uri);
      }
    } catch (error) {
      console.log('Error picking image', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const fetchData = async () => {
    try {
      const [tasksRes, notesRes] = await Promise.all([
        apiClient.get('/tasks'),
        apiClient.get('/notes')
      ]);
      const tasks = tasksRes.data || [];
      const notes = notesRes.data || [];
      setCompletedTasksCount(tasks.filter((t: any) => t.isCompleted).length);
      setNotesCount(notes.length);
      
      const activityDates = [
        ...tasks.map((t: any) => new Date(t.createdAt).toDateString()),
        ...notes.map((n: any) => new Date(n.createdAt).toDateString())
      ].filter(d => d !== 'Invalid Date');
      setStreakCount(new Set(activityDates).size);
    } catch (error) {
      console.error('Failed to fetch profile stats:', error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!editName.trim()) return;
    try {
      const res = await apiClient.put('/auth/profile', { fullName: editName });
      await updateUser(res.data.user);
      setEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (err) {
      console.error('Update profile error:', err);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => {
          logout();
        } 
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        { }
        <View style={styles.profileHeader}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: profileImage || 'https://i.pravatar.cc/150?img=12' }} style={styles.profileImage} />
            <TouchableOpacity style={styles.editImageBtn} onPress={handlePickImage}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.fullName || 'John Doe'}</Text>
          <TouchableOpacity style={styles.editProfileBtn} onPress={() => {
            setEditName(user?.fullName || '');
            setEditModalVisible(true);
          }}>
            <Text style={styles.editProfileText}>Edit Profile Info</Text>
          </TouchableOpacity>
        </View>

        { }
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle-outline" size={28} color="#10B981" />
            <Text style={styles.statValue}>{completedTasksCount}</Text>
            <Text style={styles.statLabel}>Completed Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="document-text-outline" size={28} color="#3B82F6" />
            <Text style={styles.statValue}>{notesCount}</Text>
            <Text style={styles.statLabel}>Notes Uploaded</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame-outline" size={28} color="#F59E0B" />
            <Text style={styles.statValue}>{streakCount} {streakCount === 1 ? 'Day' : 'Days'}</Text>
            <Text style={styles.statLabel}>Study Streak</Text>
          </View>
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

      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TextInput
              style={styles.modalInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Full Name"
              autoCapitalize="words"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSave} onPress={handleUpdateProfile}>
                <Text style={styles.modalBtnSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#FFF', borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 16 },
  modalInput: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 20 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  modalBtnCancel: { padding: 10, marginRight: 10 },
  modalBtnCancelText: { color: '#6B7280', fontSize: 15, fontWeight: '600' },
  modalBtnSave: { backgroundColor: '#4F46E5', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  modalBtnSaveText: { color: '#FFF', fontSize: 15, fontWeight: '600' }
});
