import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { Feather } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import apiClient from '../api/client';

export default function HomeScreen({ navigation }: any) {
  const { logout, user } = useContext(AuthContext);
  const [tasks, setTasks] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);

  const firstName = user?.fullName?.split(' ')[0] || 'Student';

  useEffect(() => {
    fetchTasks();
    fetchNotes();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await apiClient.get('/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await apiClient.get('/notes');
      setNotes(res.data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  };

  const StatCard = ({ title, count, sub, icon, color, bg, iconBg }: any) => (
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <View style={styles.header}>
          <TouchableOpacity style={styles.avatarContainer} onPress={() => navigation.navigate('Profile')}>
            <Image source={require('../../assets/icon.png')} style={styles.avatar} />
            <View style={styles.statusDot} />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.nameText}>{firstName} 👋</Text>
            <Text style={styles.readyText}>Ready to study today?</Text>
          </View>
          <TouchableOpacity style={styles.bellBtn}>
            <Feather name="bell" size={20} color="#111827" />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <StatCard title="Tasks Due" count={tasks.filter(t => !t.isCompleted).length.toString()} sub="This week" icon="check-square" color="#4F46E5" bg="#EEF2FF" iconBg="#C7D2FE" />
          <StatCard title="Indexed Notes" count={notes.length.toString()} sub="In Pinecone" icon="file-text" color="#10B981" bg="#ECFDF5" iconBg="#A7F3D0" />
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('AIChat')} style={styles.bannerContainer}>
          <ImageBackground source={require('../../assets/card.png')} style={styles.bannerImage} resizeMode="stretch">
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Ask Study Buddy AI</Text>
              <Text style={styles.bannerSub}>e.g., "What is mitosis?" or{"\n"}"Remind me to study tomorrow"</Text>
            </View>
            <View style={styles.bannerIconContainer}>
              <View style={styles.bannerArrow}><Feather name="arrow-right" size={20} color="#4F46E5" /></View>
            </View>
          </ImageBackground>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Tasks</Text>
        </View>

        {tasks.slice(0, 3).map(task => (
          <View key={task.id} style={[styles.taskItem, { borderLeftColor: task.Subject?.color || '#3B82F6' }]}>
            <Checkbox value={task.isCompleted} style={styles.checkbox} color={task.isCompleted ? "#4F46E5" : undefined} />
            <View style={styles.taskInfo}>
              <Text style={styles.itemTitle}>{task.title}</Text>
              <Text style={styles.itemSub}>{task.Subject?.title || 'General'}</Text>
            </View>
            <View style={[styles.dateBadge, { backgroundColor: `${task.Subject?.color || '#3B82F6'}33` }]}>
              <Feather name="calendar" size={12} color={task.Subject?.color || '#3B82F6'} />
              <Text style={[styles.dateText, { color: task.Subject?.color || '#3B82F6' }]}>
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="#9CA3AF" />
          </View>
        ))}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Notes</Text>
        </View>

        {notes.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 10 }}>No notes found. Upload some!</Text>
        ) : (
          notes.slice(0, 5).map(note => (
            <View key={note.id} style={styles.noteItem}>
              <View style={[styles.noteIconBox, { backgroundColor: `${note.Subject?.color || '#A855F7'}33` }]}>
                <Feather name="file-text" size={24} color={note.Subject?.color || '#A855F7'} />
              </View>
              <View style={styles.noteInfo}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.itemTitle} numberOfLines={1}>{note.title}</Text>
                  <Feather name="more-horizontal" size={20} color="#9CA3AF" />
                </View>
                <Text style={styles.noteDesc} numberOfLines={2}>{note.content}</Text>
                <View style={styles.noteFooter}>
                  <View style={styles.noteMeta}>
                    <Feather name="calendar" size={12} color="#6B7280" />
                    <Text style={styles.noteMetaText}>{new Date(note.createdAt).toLocaleDateString()}</Text>
                  </View>
                  <View style={styles.indexedBadge}>
                    <Feather name="check-circle" size={12} color="#10B981" />
                    <Text style={styles.indexedText}>Indexed</Text>
                  </View>
                  <View style={{ flex: 1 }} />
                  <View style={[styles.tagBadge, { backgroundColor: `${note.Subject?.color || '#A855F7'}33` }]}>
                    <Text style={[styles.tagText, { color: note.Subject?.color || '#A855F7' }]}>{note.Subject?.title || 'General'}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scroll: { padding: 20, paddingTop: 10, paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatarContainer: { position: 'relative', marginRight: 12 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E5E7EB' },
  statusDot: { position: 'absolute', right: 0, bottom: 0, width: 14, height: 14, borderRadius: 7, backgroundColor: '#10B981', borderWidth: 2, borderColor: '#FFF' },
  headerText: { flex: 1 },
  welcomeText: { fontSize: 13, color: '#6B7280' },
  nameText: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  readyText: { fontSize: 13, color: '#6B7280' },
  bellBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  bellDot: { position: 'absolute', top: 10, right: 12, width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEE2E2', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  logoutText: { color: '#EF4444', fontWeight: 'bold', fontSize: 13, marginLeft: 6 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { flex: 0.48, padding: 16, borderRadius: 20 },
  statIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statTitle: { fontSize: 14, color: '#1F2937', fontWeight: '500' },
  statCount: { fontSize: 32, fontWeight: 'bold', color: '#111827', marginVertical: 4 },
  statFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statSub: { fontSize: 13, color: '#6B7280' },
  statArrow: { backgroundColor: '#FFF', borderRadius: 10, overflow: 'hidden' },
  bannerContainer: { height: 160, marginBottom: 20, marginHorizontal: -12, borderRadius: 20, overflow: 'hidden' },
  bannerImage: { width: '100%', height: '100%', paddingHorizontal: 0, paddingVertical: 10, flexDirection: 'row' },
  bannerContent: { flex: 1, justifyContent: 'center', paddingLeft: 15,  },
  bannerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 30, paddingLeft: 11, },
  bannerSub: { color: '#ffffffff', fontSize: 13, lineHeight: 18, paddingLeft: 11, },
  bannerIconContainer: { justifyContent: 'flex-end', alignItems: 'center', paddingLeft: 0, paddingBottom: 18, paddingRight: 6, },
  bannerArrow: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  seeAll: { color: '#4F46E5', fontSize: 14, fontWeight: '500' },
  taskItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 12, borderLeftWidth: 4, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  checkbox: { width: 22, height: 22, borderRadius: 6, marginRight: 16, borderColor: '#D1D5DB' },
  taskInfo: { flex: 1 },
  itemTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827' },
  itemSub: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  dateBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 12 },
  dateText: { fontSize: 11, fontWeight: 'bold', marginLeft: 4 },
  noteItem: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  noteIconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  noteInfo: { flex: 1 },
  noteDesc: { fontSize: 13, color: '#6B7280', marginTop: 4, lineHeight: 18 },
  noteFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  noteMeta: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  noteMetaText: { fontSize: 11, color: '#6B7280', marginLeft: 4 },
  indexedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  indexedText: { fontSize: 11, color: '#10B981', marginLeft: 4, fontWeight: '500' },
  tagBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 11, fontWeight: 'bold' },
});