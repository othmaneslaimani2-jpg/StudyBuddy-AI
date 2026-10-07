import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import apiClient from '../api/client';

export default function TasksScreen() {
  const [activeTab, setActiveTab] = useState('all');
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await apiClient.get('/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const FilterTab = ({ id, label, count, active }: any) => (
    <TouchableOpacity style={[styles.tab, active && styles.tabActive]} onPress={() => setActiveTab(id)}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
      <View style={[styles.badge, active && styles.badgeActive]}>
        <Text style={[styles.badgeText, active && styles.badgeTextActive]}>{count}</Text>
      </View>
    </TouchableOpacity>
  );

  const TaskItem = ({ title, subject, subColor, subBg, due, dueColor, dueBg, checked, isCompleted, strike }: any) => (
    <View style={styles.taskItem}>
      <Checkbox value={checked} style={[styles.checkbox, isCompleted && styles.checkboxCompleted]} color={checked ? (isCompleted ? '#9CA3AF' : '#4F46E5') : undefined} />
      <View style={styles.taskInfo}>
        <Text style={[styles.itemTitle, strike && styles.itemStrike]}>{title}</Text>
        <View style={styles.tagsRow}>
          <View style={[styles.tag, { backgroundColor: subBg }]}><Text style={[styles.tagText, { color: subColor }]}>{subject}</Text></View>
          <View style={[styles.tag, { backgroundColor: dueBg }]}><Feather name={isCompleted ? "check-circle" : "calendar"} size={12} color={dueColor} style={{marginRight: 4}}/><Text style={[styles.tagText, { color: dueColor }]}>{due}</Text></View>
        </View>
      </View>
      <TouchableOpacity><Feather name="more-horizontal" size={20} color="#9CA3AF" /></TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconBox}><Feather name="calendar" size={24} color="#4F46E5" /></View>
            <View>
              <Text style={styles.title}>Study Schedule & Tasks</Text>
              <Text style={styles.subtitle}>Stay organized and get things done</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.addBtn}>
            <Feather name="plus" size={16} color="#FFF" />
            <Text style={styles.addBtnText}>Add Task</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabsContainer}>
          <FilterTab id="all" label="All Tasks" count={tasks.length} active={activeTab === 'all'} />
          <FilterTab id="pending" label="Pending" count={tasks.filter(t => !t.isCompleted).length} active={activeTab === 'pending'} />
          <View style={styles.tabDivider} />
          <FilterTab id="completed" label="Completed" count={tasks.filter(t => t.isCompleted).length} active={activeTab === 'completed'} />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Tasks</Text>
        </View>
        
        {tasks
          .filter(t => {
            if (activeTab === 'pending') return !t.isCompleted;
            if (activeTab === 'completed') return t.isCompleted;
            return true;
          })
          .map(task => (
            <TaskItem 
              key={task.id}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scroll: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 13, color: '#6B7280' },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4F46E5', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  addBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14, marginLeft: 6 },
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
});
