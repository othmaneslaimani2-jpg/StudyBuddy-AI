import React, { useState, useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import apiClient from '../api/client';

export default function TasksScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('all');
  const [tasks, setTasks] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const fetchTasks = async () => {
    try {
      const res = await apiClient.get('/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const handleToggleTask = async (id: string, currentStatus: boolean) => {
    try {
      setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !currentStatus } : t));
      await apiClient.put(`/tasks/${id}`, { isCompleted: !currentStatus });
    } catch (err) {
      console.error('Failed to toggle task', err);
      fetchTasks();
    }
  };

  const handleDeleteTask = (id: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          setTasks(prev => prev.filter(t => t.id !== id));
          await apiClient.delete(`/tasks/${id}`);
        } catch (err) {
          console.error('Failed to delete task', err);
          fetchTasks();
        }
      }}
    ]);
  };

  const FilterTab = ({ id, label, count, active }: any) => (
    <TouchableOpacity style={[styles.tab, active && styles.tabActive]} onPress={() => setActiveTab(id)}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
      <View style={[styles.badge, active && styles.badgeActive]}>
        <Text style={[styles.badgeText, active && styles.badgeTextActive]}>{count}</Text>
      </View>
    </TouchableOpacity>
  );

  const TaskItem = ({ id, title, subject, subColor, subBg, due, dueColor, dueBg, checked, isCompleted, strike }: any) => (
    <View style={styles.taskItem}>
      <Checkbox 
        value={checked} 
        onValueChange={() => handleToggleTask(id, isCompleted)}
        style={[styles.checkbox, isCompleted && styles.checkboxCompleted]} 
        color={checked ? (isCompleted ? '#9CA3AF' : '#4F46E5') : undefined} 
      />
      <View style={styles.taskInfo}>
        <Text style={[styles.itemTitle, strike && styles.itemStrike]}>{title}</Text>
        <View style={styles.tagsRow}>
          <View style={[styles.tag, { backgroundColor: subBg }]}><Text style={[styles.tagText, { color: subColor }]}>{subject}</Text></View>
          <View style={[styles.tag, { backgroundColor: dueBg }]}><Feather name={isCompleted ? "check-circle" : "calendar"} size={12} color={dueColor} style={{marginRight: 4}}/><Text style={[styles.tagText, { color: dueColor }]}>{due}</Text></View>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 16 }}>
        <TouchableOpacity onPress={() => handleDeleteTask(id)}>
          <Feather name="trash-2" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const pendingCount = useMemo(() => tasks.filter(t => !t.isCompleted).length, [tasks]);
  const completedCount = useMemo(() => tasks.filter(t => t.isCompleted).length, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (activeTab === 'pending') return !t.isCompleted;
      if (activeTab === 'completed') return t.isCompleted;
      return true;
    });
  }, [tasks, activeTab]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}><Feather name="calendar" size={24} color="#4F46E5" /></View>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.title} numberOfLines={1}>Study Schedule & Tasks</Text>
              <Text style={styles.subtitle} numberOfLines={1}>Stay organized and get things done</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <FilterTab id="all" label="All Tasks" count={tasks.length} active={activeTab === 'all'} />
          <FilterTab id="pending" label="Pending" count={pendingCount} active={activeTab === 'pending'} />
          <View style={styles.tabDivider} />
          <FilterTab id="completed" label="Completed" count={completedCount} active={activeTab === 'completed'} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Tasks</Text>
        </View>
        
        {filteredTasks
          .map(task => (
            <TaskItem 
              key={task.id}
              id={task.id}
              title={task.title} 
              subject={task.Subject?.title || 'General'} 
              subColor={task.Subject?.color || '#3B82F6'} 
              subBg={`${task.Subject?.color || '#3B82F6'}33`} 
              due={task.isCompleted ? 'Completed' : `Due: ${new Date(task.dueDate).toLocaleDateString()}`} 
              dueColor={task.isCompleted ? '#10B981' : '#EF4444'} 
              dueBg={task.isCompleted ? '#D1FAE5' : '#FEE2E2'} 
              checked={task.isCompleted} 
              isCompleted={task.isCompleted} 
              strike={task.isCompleted} 
            />
          ))}

      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddTask')}>
        <Feather name="plus" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scroll: { padding: 20, paddingTop: 10, paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6B7280' },
  tabsContainer: { flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 20, padding: 4, marginBottom: 24, alignItems: 'center' },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 16 },
  tabActive: { backgroundColor: '#4F46E5' },
  tabText: { fontSize: 14, fontWeight: '500', color: '#4B5563' },
  tabTextActive: { color: '#FFF' },
  badge: { backgroundColor: '#E5E7EB', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, marginLeft: 6 },
  badgeActive: { backgroundColor: '#FFF' },
  badgeText: { fontSize: 12, fontWeight: 'bold', color: '#4B5563' },
  badgeTextActive: { color: '#4F46E5' },
  tabDivider: { width: 1, height: 20, backgroundColor: '#D1D5DB', marginHorizontal: 4 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  sectionMeta: { fontSize: 13, color: '#6B7280' },
  completedBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, marginLeft: 10 },
  completedBadgeText: { color: '#4F46E5', fontSize: 13, fontWeight: 'bold' },
  clearText: { color: '#9CA3AF', fontSize: 13 },
  taskItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  checkbox: { width: 24, height: 24, borderRadius: 6, marginRight: 16, borderColor: '#D1D5DB' },
  checkboxCompleted: { backgroundColor: '#9CA3AF', borderColor: '#9CA3AF' },
  taskInfo: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  itemStrike: { textDecorationLine: 'line-through', color: '#9CA3AF' },
  tagsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  tag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginRight: 8 },
  tagText: { fontSize: 11, fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center', shadowColor: '#4F46E5', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5 },
});
