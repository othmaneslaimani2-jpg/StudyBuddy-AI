import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/client';
import { HomeScreenNavigationProp } from '../types/navigation';

interface Subject {
    id: string;
    title: string;
    color: string;
}

interface Task {
    id: string;
    title: string;
    dueDate: string;
    isCompleted?: boolean;
    subjectId?: string;
    Subject?: Subject;
}

interface Props {
    navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
    const { logout } = useContext(AuthContext);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [tasksRes, subjectsRes] = await Promise.all([
                apiClient.get('/tasks'),
                apiClient.get('/subjects'),
            ]);
            setTasks(tasksRes.data);
            setSubjects(subjectsRes.data);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderTaskItem = ({ item }: { item: Task }) => (
        <View style={styles.taskCard}>
            <View style={[styles.colorBadge, { backgroundColor: item.Subject?.color || '#4F46E5' }]} />
            <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskSub}>{item.Subject?.title || 'General'} • Due: {new Date(item.dueDate).toLocaleDateString()}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome back! 👋</Text>
                    <Text style={styles.subGreeting}>StudyBuddy AI Dashboard</Text>
                </View>
                <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={[styles.actionCard, { backgroundColor: '#4F46E5' }]}
                    onPress={() => navigation.navigate('AIChat')}
                >
                    <Text style={styles.actionIcon}>🤖</Text>
                    <Text style={styles.actionTitle}>AI Tutor</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionCard, { backgroundColor: '#10B981' }]}
                    onPress={() => navigation.navigate('UploadNote')}
                >
                    <Text style={styles.actionIcon}>📄</Text>
                    <Text style={styles.actionTitle}>Upload Note</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Upcoming Tasks ({tasks.length})</Text>

            {loading ? (
                <ActivityIndicator size="small" color="#4F46E5" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id}
                    renderItem={renderTaskItem}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No upcoming tasks! Ask AI Tutor to add one.</Text>
                    }
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB', paddingTop: 60, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    greeting: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
    subGreeting: { fontSize: 14, color: '#6B7280' },
    logoutBtn: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
    logoutText: { color: '#EF4444', fontWeight: '600', fontSize: 13 },
    actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
    actionCard: { flex: 0.48, borderRadius: 16, padding: 20, alignItems: 'center', justifyContent: 'center' },
    actionIcon: { fontSize: 28, marginBottom: 8 },
    actionTitle: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
    taskCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
    colorBadge: { width: 10, height: 40, borderRadius: 5, marginRight: 14 },
    taskInfo: { flex: 1 },
    taskTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
    taskSub: { fontSize: 13, color: '#6B7280', marginTop: 4 },
    emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 30, fontSize: 14 },
});