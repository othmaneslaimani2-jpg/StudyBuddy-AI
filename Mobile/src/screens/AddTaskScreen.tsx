import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import apiClient from '../api/client';

const FieldHeader = ({ icon, color, bg, label, opt }: any) => (
  <View style={styles.fieldHeader}>
    <View style={[styles.iconBox, { backgroundColor: bg }]}><Feather name={icon} size={16} color={color} /></View>
    <Text style={styles.fieldLabel}>{label} {opt && <Text style={{ color: '#9CA3AF', fontWeight: 'normal' }}>(Optional)</Text>}</Text>
  </View>
);

const Dropdown = ({ icon, value, onPress }: any) => (
  <TouchableOpacity style={styles.dropdown} onPress={onPress}>
    <Feather name={icon} size={16} color="#111827" />
    <Text style={styles.dropdownText}>{value}</Text>
    <Feather name="chevron-down" size={16} color="#6B7280" />
  </TouchableOpacity>
);

export default function AddTaskScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectName, setSubjectName] = useState('');
  
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [priority, setPriority] = useState('Medium');
  const [reminder, setReminder] = useState('1 day before');
  const [loading, setLoading] = useState(false);

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) setDueDate(selectedDate);
  };

  const onTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (selectedDate) setDueDate(selectedDate);
  };

  const dateStr = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = dueDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const handleCreateTask = async () => {
    if (!title.trim()) return Alert.alert('Validation Error', 'Task title is required.');
    if (!subjectName.trim()) return Alert.alert('Validation Error', 'Please enter a subject.');
    
    setLoading(true);
    try {
      const dueDateIso = dueDate.toISOString();
      await apiClient.post('/tasks', { title, dueDate: dueDateIso, subject: subjectName, description, priority, reminder });
      
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to create task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Feather name="chevron-left" size={24} color="#111827" /></TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Add Task</Text>
          <Text style={styles.headerSubtitle}>Create a new task for your study plan</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <Image source={require('../../assets/add task artwork.png')} style={styles.artwork} resizeMode="contain" />

          <View style={styles.card}>
            <FieldHeader icon="file" color="#4F46E5" bg="#EEF2FF" label="Task Title" />
            <TextInput style={styles.input} placeholder="e.g. Read Chapter 3" placeholderTextColor="#9CA3AF" value={title} onChangeText={setTitle} />
          </View>

          <View style={styles.card}>
            <FieldHeader icon="list" color="#9333EA" bg="#F3E8FF" label="Description" opt />
            <TextInput style={[styles.input, styles.textArea]} placeholder="Add more details about this task..." placeholderTextColor="#9CA3AF" multiline numberOfLines={4} maxLength={200} value={description} onChangeText={setDescription} />
            <Text style={styles.charCount}>{description.length}/200</Text>
          </View>

          <View style={styles.card}>
            <FieldHeader icon="book-open" color="#2563EB" bg="#DBEAFE" label="Subject" />
            <TextInput style={styles.input} placeholder="e.g. Mathematics" placeholderTextColor="#9CA3AF" value={subjectName} onChangeText={setSubjectName} />
          </View>

          <View style={styles.row}>
            <View style={[styles.card, styles.halfCard]}>
              <FieldHeader icon="calendar" color="#DB2777" bg="#FCE7F3" label="Due Date" />
              <Dropdown icon="calendar" value={dateStr} onPress={() => setShowDatePicker(true)} />
            </View>
            <View style={[styles.card, styles.halfCard]}>
              <FieldHeader icon="clock" color="#7C3AED" bg="#EDE9FE" label="Due Time" />
              <Dropdown icon="clock" value={timeStr} onPress={() => setShowTimePicker(true)} />
            </View>
          </View>

          {showDatePicker && (
            <View style={Platform.OS === 'ios' ? styles.iosPickerContainer : undefined}>
              {Platform.OS === 'ios' && (
                <TouchableOpacity onPress={() => setShowDatePicker(false)} style={styles.doneBtn}>
                  <Text style={styles.doneBtnText}>Done</Text>
                </TouchableOpacity>
              )}
              <DateTimePicker value={dueDate} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onDateChange} />
            </View>
          )}

          {showTimePicker && (
            <View style={Platform.OS === 'ios' ? styles.iosPickerContainer : undefined}>
              {Platform.OS === 'ios' && (
                <TouchableOpacity onPress={() => setShowTimePicker(false)} style={styles.doneBtn}>
                  <Text style={styles.doneBtnText}>Done</Text>
                </TouchableOpacity>
              )}
              <DateTimePicker value={dueDate} mode="time" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onTimeChange} />
            </View>
          )}

          <View style={styles.card}>
            <FieldHeader icon="flag" color="#EA580C" bg="#FFEDD5" label="Priority" />
            <View style={styles.priorityRow}>
              {[
                { p: 'Low', bg: '#D1FAE5', txt: '#059669', ic: '#059669', base: '#F9FAFB', bd: '#10B981' },
                { p: 'Medium', bg: '#FFEDD5', txt: '#EA580C', ic: '#EA580C', base: '#F9FAFB', bd: '#F97316' },
                { p: 'High', bg: '#FEE2E2', txt: '#DC2626', ic: '#DC2626', base: '#F9FAFB', bd: '#EF4444' }
              ].map(({ p, bg, txt, ic, base, bd }) => (
                <TouchableOpacity key={p} style={[styles.priorityPill, { backgroundColor: priority === p ? bg : base }, priority === p && bd && { borderWidth: 1, borderColor: bd }]} onPress={() => setPriority(p)}>
                  <Feather name="flag" size={14} color={priority === p ? ic : '#9CA3AF'} style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 13, fontWeight: '600', color: priority === p ? txt : '#6B7280' }}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <FieldHeader icon="bell" color="#059669" bg="#D1FAE5" label="Reminder" />
            <Dropdown icon="bell" value={reminder} onPress={() => {}} />
          </View>
          <View style={{ height: 20 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitBtn} onPress={handleCreateTask} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : (
            <>
              <Feather name="plus-circle" size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.submitBtnText}>Create Task</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  headerTextContainer: { alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  headerSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  scroll: { paddingHorizontal: 16 },
  artwork: { width: '100%', height: 180, marginBottom: 16 },
  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  halfCard: { flex: 1 },
  row: { flexDirection: 'row', gap: 12 },
  fieldHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBox: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  fieldLabel: { fontSize: 15, fontWeight: '700', color: '#111827' },
  input: { backgroundColor: '#F9FAFB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 14, color: '#111827', borderWidth: 1, borderColor: '#F3F4F6' },
  textArea: { height: 100, textAlignVertical: 'top' },
  charCount: { textAlign: 'right', fontSize: 11, color: '#9CA3AF', marginTop: 6 },
  subjectScroll: { flexDirection: 'row' },
  pill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 8 },
  dropdown: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  dropdownText: { flex: 1, fontSize: 14, color: '#111827', marginLeft: 10 },
  priorityRow: { flexDirection: 'row', justifyContent: 'space-between' },
  priorityPill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, marginHorizontal: 4 },
  footer: { padding: 16, paddingBottom: 24, backgroundColor: '#FAFAFF' },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4F46E5', paddingVertical: 16, borderRadius: 16, shadowColor: '#4F46E5', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5 },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  iosPickerContainer: { backgroundColor: '#FFF', borderRadius: 12, marginTop: 10, paddingBottom: 10 },
  doneBtn: { alignItems: 'flex-end', padding: 12 },
  doneBtnText: { color: '#4F46E5', fontWeight: 'bold', fontSize: 16 }
});
