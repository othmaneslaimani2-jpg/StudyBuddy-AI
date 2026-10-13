import React, { useState, useCallback } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiClient from '../api/client';
import { ScreenHeader, NoteCard, EmptyState, FAB } from '../components';

export default function NotesScreen() {
  const router = useRouter();
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
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setNotes(prev => prev.filter(n => n.id !== id));
            await apiClient.delete(`/notes/${id}`);
          } catch (err) {
            console.error('Failed to delete note', err);
            fetchNotes();
          }
        },
      },
    ]);
  };

  const uniqueSubjects = Array.from(new Set(notes.map(n => n.Subject?.title).filter(Boolean)));
  const filterTabs = ['All Subjects', ...uniqueSubjects];

  const filteredNotes = notes.filter(n => {
    const matchesTab = activeSub === 'All Subjects' || n.Subject?.title === activeSub;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.Subject?.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <ScreenHeader
          icon="book-open"
          title="Class Notes Library"
          subtitle="Your study notes, indexed with AI"
        />

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
                <TouchableOpacity
                  key={i}
                  style={[styles.filterTab, active ? styles.filterTabActive : styles.filterTabInactive]}
                  onPress={() => setActiveSub(label as string)}
                >
                  <Text style={[styles.filterTabText, active ? styles.filterTabTextActive : styles.filterTabTextInactive]}>
                    {label as string}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {filteredNotes.length === 0 ? (
          <EmptyState
            icon="book-open"
            title="No notes found"
            description={
              searchQuery
                ? `No notes match "${searchQuery}".`
                : "No notes uploaded yet. Tap '+' below to add your first note."
            }
          />
        ) : (
          filteredNotes.map(n => (
            <NoteCard
              key={n.id}
              id={n.id}
              title={n.title}
              content={n.content}
              subjectTitle={n.Subject?.title}
              subjectColor={n.Subject?.color}
              createdAt={n.createdAt}
              onDelete={handleDeleteNote}
            />
          ))
        )}
      </ScrollView>

      <FAB onPress={() => router.push('/upload-note')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  searchRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterScrollContainer: {
    marginBottom: 12,
  },
  filterScroll: {
    paddingRight: 20,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterTabActive: {
    backgroundColor: '#4F46E5',
  },
  filterTabInactive: {
    backgroundColor: '#F3F4F6',
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: '#FFF',
  },
  filterTabTextInactive: {
    color: '#4B5563',
  },
});
