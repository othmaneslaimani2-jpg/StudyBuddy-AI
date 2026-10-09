import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import apiClient from '../api/client';
import { UploadNoteScreenNavigationProp } from '../types/navigation';

interface Props {
  navigation: UploadNoteScreenNavigationProp;
}

const FORMATS = [
  { label: 'PDF', bg: '#F43F5E', isText: true },
  { label: 'DOC', bg: '#3B82F6', isText: true },
  { label: 'DOCX', bg: '#10B981', isText: true },
  { label: 'JPG / PNG', bg: '#8B5CF6', isText: false },
];

const INFO_BULLETS = [
  'Maximum file size: 10 MB',
  'Supports handwritten or typed notes',
];

export default function UploadNoteScreen({ navigation }: Props) {
  const [title, setTitle] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePickDocument = async () => {
    if (!title.trim() || !subjectName.trim()) {
      return Alert.alert('Validation Error', 'Please enter a title and subject before uploading.');
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        
        setLoading(true);
        // Simulate file reading/uploading for MVP
        const dummyContent = `This is mock extracted content from the file: ${file.name}.`;
        
        try {
          await apiClient.post('/notes', {
            title,
            subject: subjectName,
            content: dummyContent
          });
          Alert.alert('Success', 'Note uploaded successfully!');
          navigation.goBack();
        } catch (apiErr) {
          Alert.alert('Error', 'Failed to upload note to server.');
          console.error(apiErr);
        } finally {
          setLoading(false);
        }
      }
    } catch (err) {
      console.error('Error picking document:', err);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        { }
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Upload Note</Text>
            <Text style={styles.subtitle}>Add your study notes and let AI help you</Text>
          </View>
        </View>

        { }
        <Image
          source={require('../../assets/Artwork.png')}
          style={styles.artwork}
          resizeMode="contain"
        />

        <View style={{ width: '100%', marginBottom: 16 }}>
          <Text style={styles.inputLabel}>Title</Text>
          <TextInput style={styles.input} placeholder="Note Title" value={title} onChangeText={setTitle} />
        </View>
        <View style={{ width: '100%', marginBottom: 24 }}>
          <Text style={styles.inputLabel}>Subject</Text>
          <TextInput style={styles.input} placeholder="e.g. Mathematics" value={subjectName} onChangeText={setSubjectName} />
        </View>

        { }
        <View style={styles.uploadContainer}>
          <View style={styles.uploadIconContainer}>
            <MaterialCommunityIcons name="file-upload-outline" size={32} color="#4F46E5" />
          </View>
          <Text style={styles.uploadTitle}>Upload Your Note</Text>
          <Text style={styles.uploadSubtitle}>Drag and drop your file here, or tap to browse</Text>
          <TouchableOpacity style={styles.chooseFileBtn} activeOpacity={0.8} onPress={handlePickDocument} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.chooseFileText}>Choose File</Text>}
          </TouchableOpacity>
        </View>

        { }
        <View style={styles.formatsSection}>
          <Text style={styles.formatsTitle}>Supported Formats</Text>
          <View style={styles.formatCardsContainer}>
            {FORMATS.map((f, i) => (
              <View key={i} style={styles.formatCard}>
                <View style={[styles.formatIconBg, { backgroundColor: f.bg }]}>
                  {f.isText ? (
                    <Text style={styles.formatIconText}>{f.label}</Text>
                  ) : (
                    <Ionicons name="image-outline" size={20} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.formatText}>{f.label}</Text>
              </View>
            ))}
          </View>
        </View>

        { }
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color="#4F46E5" style={styles.infoIcon} />
          <View style={styles.infoTextContainer}>
            {INFO_BULLETS.map((text, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={styles.bullet} />
                <Text style={styles.infoText}>{text}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFF',
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  artwork: {
    width: '100%',
    height: 180,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  uploadContainer: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    borderStyle: 'dashed',
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 28,
  },
  uploadIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  chooseFileBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  chooseFileText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  formatsSection: {
    width: '100%',
    marginBottom: 24,
  },
  formatsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  formatCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  formatCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    width: '23%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  formatIconBg: {
    width: 40,
    height: 48,
    borderRadius: 8,
    borderTopRightRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  formatIconText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  formatText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
    paddingTop: 2,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#6B7280',
    marginRight: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
  },
});