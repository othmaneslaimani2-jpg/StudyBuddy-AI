import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';

const TABS = [
  { label: 'All Subjects' },
  { label: 'Biology', icon: 'feather', color: '#10B981' },
  { label: 'History', icon: 'book-open', color: '#F97316' },
  { label: 'Math', icon: 'activity', color: '#3B82F6' },
  { label: 'Chemistry', icon: 'loader', color: '#EC4899' },
];

const NOTES = [
  { id: '1', title: "Biology Ch. 3 - Mitosis & Cell Division", desc: "Mitosis is the process by which a single cell divides into two identical daughter cells. It helps with growth...", date: "Sep 26, 2026", pages: "12", subject: "Biology", subColor: "#10B981", subBg: "#D1FAE5" },
  { id: '2', title: "History - World War II Notes", desc: "Key events leading to World War II include the Treaty of Versailles, the rise of totalitarian regimes...", date: "Sep 24, 2026", pages: "18", subject: "History", subColor: "#F97316", subBg: "#FFEDD5" },
  { id: '3', title: "Calculus - Derivatives", desc: "The derivative represents the rate of change of a function. It can be interpreted as the slope of the...", date: "Sep 20, 2026", pages: "14", subject: "Mathematics", subColor: "#3B82F6", subBg: "#DBEAFE" },
  { id: '4', title: "Chemistry - Organic Reactions", desc: "Organic reactions involve the transformation of carbon compounds. Common reaction types include...", date: "Sep 18, 2026", pages: "10", subject: "Chemistry", subColor: "#EC4899", subBg: "#FCE7F3" },
  { id: '5', title: "Computer Science - Data Structures", desc: "Arrays, linked lists, stacks and queues are fundamental data structures used to organize and store data efficiently...", date: "Sep 15, 2026", pages: "16", subject: "Computer Science", subColor: "#F59E0B", subBg: "#FEF3C7" },
];

export default function NotesScreen() {
  const [activeSub, setActiveSub] = useState('All Subjects');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Class Notes Library</Text>
          <Text style={styles.subtitle}>Your study notes, indexed with AI</Text>
        </View>
        <TouchableOpacity style={styles.addBtn}>
          <Feather name="plus" size={16} color="#FFF" />
          <Text style={styles.addBtnText}>Add Note</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput style={styles.searchInput} placeholder="Search notes..." placeholderTextColor="#9CA3AF" />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Feather name="sliders" size={20} color="#111827" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterScrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {TABS.map((t, i) => {
            const active = activeSub === t.label;
            return (
              <TouchableOpacity key={i} style={[styles.filterTab, active ? styles.filterTabActive : styles.filterTabInactive]} onPress={() => setActiveSub(t.label)}>
                {t.icon && <Feather name={t.icon as any} size={14} color={active ? '#FFF' : t.color} style={{ marginRight: 6 }} />}
                <Text style={[styles.filterTabText, active ? styles.filterTabTextActive : styles.filterTabTextInactive]}>{t.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {NOTES.map(n => (
          <View key={n.id} style={styles.noteCard}>
            <View style={[styles.noteIconBox, { backgroundColor: n.subBg }]}><Feather name="file-text" size={28} color={n.subColor} /></View>
            <View style={styles.noteInfo}>
              <View style={styles.cardHeader}>
                <View style={styles.indexedBadge}><Feather name="check-circle" size={12} color="#10B981" /><Text style={styles.indexedText}>Indexed in Pinecone</Text></View>
                <TouchableOpacity><Feather name="more-horizontal" size={20} color="#9CA3AF" /></TouchableOpacity>
              </View>
              <Text style={styles.noteTitle} numberOfLines={1}>{n.title}</Text>
              <Text style={styles.noteDesc} numberOfLines={2}>{n.desc}</Text>
              <View style={styles.cardFooter}>
                <View style={styles.metaRow}>
                  <Feather name="calendar" size={12} color="#6B7280" /><Text style={styles.metaText}>{n.date}</Text>
                  <Text style={styles.metaDot}>•</Text>
                  <Feather name="file" size={12} color="#6B7280" /><Text style={styles.metaText}>{n.pages} pages</Text>
                </View>
                <View style={[styles.tagBadge, { backgroundColor: n.subBg }]}><Text style={[styles.tagText, { color: n.subColor }]}>{n.subject}</Text></View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scroll: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20 },
  headerLeft: { flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  subtitle: { fontSize: 14, color: '#6B7280', marginTop: 4 },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#4F46E5', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 },
  addBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14, marginLeft: 6 },
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
});
