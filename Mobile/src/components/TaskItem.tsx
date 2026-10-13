import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';

export interface TaskItemProps {
  id: string;
  title: string;
  subjectTitle?: string;
  subjectColor?: string;
  dueDate: string | Date;
  isCompleted: boolean;
  onToggle: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  id,
  title,
  subjectTitle = 'General',
  subjectColor = '#4F46E5',
  dueDate,
  isCompleted,
  onToggle,
  onDelete,
}) => {
  const subBg = `${subjectColor}20`;
  const formattedDate = new Date(dueDate).toLocaleDateString();
  const dueText = isCompleted ? 'Completed' : `Due: ${formattedDate}`;
  const dueColor = isCompleted ? '#10B981' : '#EF4444';
  const dueBg = isCompleted ? '#D1FAE5' : '#FEE2E2';

  return (
    <View style={styles.taskItem}>
      <Checkbox
        value={isCompleted}
        onValueChange={() => onToggle(id, isCompleted)}
        style={[styles.checkbox, isCompleted && styles.checkboxCompleted]}
        color={isCompleted ? '#9CA3AF' : '#4F46E5'}
      />

      <View style={styles.taskInfo}>
        <Text style={[styles.itemTitle, isCompleted && styles.itemStrike]} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.tagsRow}>
          <View style={[styles.tag, { backgroundColor: subBg }]}>
            <Text style={[styles.tagText, { color: subjectColor }]}>{subjectTitle}</Text>
          </View>
          <View style={[styles.tag, { backgroundColor: dueBg }]}>
            <Feather
              name={isCompleted ? 'check-circle' : 'calendar'}
              size={12}
              color={dueColor}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.tagText, { color: dueColor }]}>{dueText}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather name="trash-2" size={18} color="#EF4444" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    marginRight: 14,
    borderColor: '#D1D5DB',
  },
  checkboxCompleted: {
    backgroundColor: '#9CA3AF',
    borderColor: '#9CA3AF',
  },
  taskInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  itemStrike: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  deleteBtn: {
    padding: 6,
    marginLeft: 8,
  },
});
