import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiClient from '../api/client';



export default function NotesScreen({ navigation }: any) {
  const [activeSub, setActiveSub] = useState('All Subjects');
  const [notes, setNotes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
    }, [])
  );

  const fetchNotes = async () => {
    try {
      const res = await apiClient.get('/notes');
      setNotes(res.data);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
    }
  };

  const handleDeleteNote = (id: string) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          setNotes(prev => prev.filter(n => n.id !== id));
          await apiClient.delete(`/notes/${id}`);
        } catch (err) {
          console.error('Failed to delete note', err);
          fetchNotes();
        }
      }}
    ]);
  };

  const uniqueSubjects = Array.from(new Set(notes.map(n => n.Subject?.title).filter(Boolean)));
  const filterTabs = ['All Subjects', ...uniqueSubjects];

  const filteredNotes = notes.filter(n => {
    const matchesTab = activeSub === 'All Subjects' || n.Subject?.title === activeSub;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.Subject?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}><Feather name="book-open" size={24} color="#4F46E5" /></View>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={styles.title} numberOfLines={1}>Class Notes Library</Text>
            <Text style={styles.subtitle} numberOfLines={1}>Your study notes, indexed with AI</Text>
          </View>
        </View>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search notes..." 
            placeholderTextColor="#9CA3AF" 
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Feather name="sliders" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterScrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {filterTabs.map((label, i) => {
            const active = activeSub === label;
            return (
              <TouchableOpacity key={i} style={[styles.filterTab, active ? styles.filterTabActive : styles.filterTabInactive]} onPress={() => setActiveSub(label as string)}>
                <Text style={[styles.filterTabText, active ? styles.filterTabTextActive : styles.filterTabTextInactive]}>{label as string}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {filteredNotes.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 20 }}>No notes found.</Text>
        ) : (
          filteredNotes.map(n => {
            const subColor = n.Subject?.color || '#3B82F6';
            const subBg = `${subColor}33`;
            const subjectTitle = n.Subject?.title || 'General';
            return (
              <View key={n.id} style={styles.noteCard}>
                <View style={[styles.noteIconBox, { backgroundColor: subBg }]}><Feather name="file-text" size={28} color={subColor} /></View>
                <View style={styles.noteInfo}>
                  <View style={styles.cardHeader}>
                    <View style={styles.indexedBadge}><Feather name="check-circle" size={12} color="#10B981" /><Text style={styles.indexedText}>Indexed in Pinecone</Text></View>
                    <TouchableOpacity onPress={() => handleDeleteNote(n.id)}><Feather name="trash-2" size={20} color="#EF4444" /></TouchableOpacity>
                  </View>
                  <Text style={styles.noteTitle} numberOfLines={1}>{n.title}</Text>
                  <Text style={styles.noteDesc} numberOfLines={2}>{n.content}</Text>
                  <View style={styles.cardFooter}>
                    <View style={styles.metaRow}>
                      <Feather name="calendar" size={12} color="#6B7280" /><Text style={styles.metaText}>{new Date(n.createdAt).toLocaleDateString()}</Text>
                      <Text style={styles.metaDot}>•</Text>
                      <Feather name="file" size={12} color="#6B7280" /><Text style={styles.metaText}>Document</Text>
                    </View>
                    <View style={[styles.tagBadge, { backgroundColor: subBg }]}><Text style={[styles.tagText, { color: subColor }]}>{subjectTitle}</Text></View>
                  </View>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('UploadNote')}>
        <Feather name="plus" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  title: { fontSize: 24, fontWeight: '800', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  searchRow: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 16 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 24, paddingHorizontal: 16, height: 48, borderWidth: 1, borderColor: '#E5E7EB' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: '#111827' },
  filterBtn: { width: 48, height: 48, backgroundColor: '#FFF', borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginLeft: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  filterScrollContainer: { height: 50, marginBottom: 10 },
  filterScroll: { paddingHorizontal: 20, alignItems: 'center' },
  filterTab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 10 },
  filterTabActive: { backgroundColor: '#4F46E5' },
  filterTabInactive: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB' },
  filterTabText: { fontSize: 13, fontWeight: '600' },
  filterTabTextActive: { color: '#FFF' },
  filterTabTextInactive: { color: '#4B5563' },
  noteCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 10, elevation: 2 },
  noteIconBox: { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  noteInfo: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  indexedBadge: { flexDirection: 'row', alignItems: 'center' },
  indexedText: { fontSize: 11, color: '#10B981', marginLeft: 4, fontWeight: '600' },
  noteTitle: { fontSize: 15, fontWeight: 'bold', color: '#111827' },
  noteDesc: { fontSize: 13, color: '#6B7280', marginTop: 4, lineHeight: 18 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 11, color: '#6B7280', marginLeft: 4 },
  metaDot: { fontSize: 11, color: '#9CA3AF', marginHorizontal: 6 },
  tagBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagText: { fontSize: 11, fontWeight: 'bold' },
  fab: { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center', shadowColor: '#4F46E5', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5 },
});
