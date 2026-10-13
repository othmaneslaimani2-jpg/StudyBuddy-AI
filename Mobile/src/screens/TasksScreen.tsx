import React, { useState, useCallback, useMemo } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiClient from '../api/client';
import { ScreenHeader, FilterTabs, TaskItem, EmptyState, FAB } from '../components';

export default function TasksScreen() {
  const router = useRouter();
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
      setTasks(prev => prev.map(t => (t.id === id ? { ...t, isCompleted: !currentStatus } : t)));
      await apiClient.put(`/tasks/${id}`, { isCompleted: !currentStatus });
    } catch (err) {
      console.error('Failed to toggle task', err);
      fetchTasks();
    }
  };

  const handleDeleteTask = (id: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setTasks(prev => prev.filter(t => t.id !== id));
            await apiClient.delete(`/tasks/${id}`);
          } catch (err) {
            console.error('Failed to delete task', err);
            fetchTasks();
          }
        },
      },
    ]);
  };

  const pendingCount = useMemo(() => tasks.filter(t => !t.isCompleted).length, [tasks]);
  const completedCount = useMemo(() => tasks.filter(t => t.isCompleted).length, [tasks]);

  const filterTabOptions = useMemo(
    () => [
      { id: 'all', label: 'All Tasks', count: tasks.length },
      { id: 'pending', label: 'Pending', count: pendingCount },
      { id: 'completed', label: 'Completed', count: completedCount },
    ],
    [tasks.length, pendingCount, completedCount]
  );

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
        <ScreenHeader
          icon="calendar"
          title="Study Schedule & Tasks"
          subtitle="Stay organized and get things done"
        />

        <FilterTabs
          tabs={filterTabOptions}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Tasks</Text>
        </View>

        {filteredTasks.length === 0 ? (
          <EmptyState
            icon="check-circle"
            title="No tasks found"
            description={
              activeTab === 'completed'
                ? "You haven't completed any tasks yet."
                : activeTab === 'pending'
                ? "You don't have any pending tasks. Great job!"
                : "No tasks created yet. Tap '+' below to add one."
            }
          />
        ) : (
          filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.title}
              subjectTitle={task.Subject?.title}
              subjectColor={task.Subject?.color}
              dueDate={task.dueDate}
              isCompleted={task.isCompleted}
              onToggle={handleToggleTask}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </ScrollView>

      <FAB onPress={() => router.push('/add-task')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scroll: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
});
