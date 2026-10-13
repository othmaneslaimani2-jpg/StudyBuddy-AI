import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  subjectTitle?: string;
  subjectColor?: string;
  createdAt: string | Date;
  onDelete: (id: string) => void;
  onPress?: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({
  id,
  title,
  content,
  subjectTitle = 'General',
  subjectColor = '#3B82F6',
  createdAt,
  onDelete,
  onPress,
}) => {
  const subBg = `${subjectColor}20`;
  const formattedDate = new Date(createdAt).toLocaleDateString();

  return (
    <TouchableOpacity
      style={styles.noteCard}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <View style={[styles.noteIconBox, { backgroundColor: subBg }]}>
        <Feather name="file-text" size={28} color={subjectColor} />
      </View>

      <View style={styles.noteInfo}>
        <View style={styles.cardHeader}>
          <View style={styles.indexedBadge}>
            <Feather name="check-circle" size={12} color="#10B981" />
            <Text style={styles.indexedText}>Indexed in Pinecone</Text>
          </View>
          <TouchableOpacity
            onPress={() => onDelete(id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Feather name="trash-2" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <Text style={styles.noteTitle} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.noteDesc} numberOfLines={2}>
          {content}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.metaRow}>
            <Feather name="calendar" size={12} color="#6B7280" />
            <Text style={styles.metaText}>{formattedDate}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Feather name="file" size={12} color="#6B7280" />
            <Text style={styles.metaText}>Document</Text>
          </View>
          <View style={[styles.tagBadge, { backgroundColor: subBg }]}>
            <Text style={[styles.tagText, { color: subjectColor }]}>{subjectTitle}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  noteCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  noteIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  noteInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  indexedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  indexedText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '700',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  noteDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#6B7280',
  },
  metaDot: {
    fontSize: 11,
    color: '#9CA3AF',
    marginHorizontal: 2,
  },
  tagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
