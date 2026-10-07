import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import apiClient from '../api/client';
import { UploadNoteScreenNavigationProp } from '../types/navigation';

interface Subject {
  id: string;
  title: string;
  color?: string;
}

interface Props {
  navigation: UploadNoteScreenNavigationProp;
}

export default function UploadNoteScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await apiClient.get('/subjects');
      setSubjects(response.data);
      if (response.data.length > 0) {
        setSelectedSubjectId(response.data[0].id);
      }
    } catch (error) {
      console.error('Failed to load subjects:', error);
    }
  };

  const handleUpload = async () => {
    if (!title || !content || !selectedSubjectId) {
      Alert.alert('Missing Fields', 'Please fill in all fields before uploading.');
      return;
    }

    try {
      setLoading(true);
      await apiClient.post('/notes', {
        title,
        content,
        subjectId: selectedSubjectId,
      });

      Alert.alert('Success 🎉', 'Note uploaded and vectorised for Gemini AI!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to upload note.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.headerTitle}>Upload Class Note 📄</Text>
      <Text style={styles.subtitle}>
        Your note will be stored and indexed into Pinecone so your Gemini AI Tutor can answer questions about it.
      </Text>

      <Text style={styles.label}>Note Title</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Chapter 3: Photosynthesis Notes"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Select Subject</Text>
      <View style={styles.subjectContainer}>
        {subjects.map((sub) => (
          <TouchableOpacity
            key={sub.id}
            style={[
              styles.subjectChip,
              selectedSubjectId === sub.id && { backgroundColor: sub.color || '#4F46E5', borderColor: sub.color },
            ]}
            onPress={() => setSelectedSubjectId(sub.id)}
          >
            <Text
              style={[
                styles.chipText,
                selectedSubjectId === sub.id && { color: '#FFFFFF', fontWeight: 'bold' },
              ]}
            >
              {sub.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Note Content</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Paste your study material or class summary here..."
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={8}
        textAlignVertical="top"
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleUpload} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.btnText}>Upload & Vectorise Note</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', paddingTop: 60, paddingHorizontal: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 24, lineHeight: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, padding: 14, marginBottom: 20, fontSize: 15 },
  textArea: { height: 180 },
  subjectContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  subjectChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#D1D5DB', backgroundColor: '#FFFFFF' },
  chipText: { fontSize: 13, color: '#374151' },
  submitBtn: { backgroundColor: '#4F46E5', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});