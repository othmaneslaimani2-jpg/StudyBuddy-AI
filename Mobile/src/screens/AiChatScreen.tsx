import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import apiClient from '../api/client';

interface Message { id: string; sender: 'ai' | 'user'; text: string; actionExecuted?: boolean; }

export default function AIChatScreen({ navigation }: any) {
  const [messages, setMessages] = useState<Message[]>([{ id: '1', sender: 'ai', text: 'Hello! I am your StudyBuddy AI Tutor. Ask me anything about your notes or tell me to schedule a task!' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    const promptText = input; setInput(''); setLoading(true);

    try {
      const response = await apiClient.post('/ai/chat', { message: promptText });
      setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'ai', text: response.data.reply, actionExecuted: response.data.actionExecuted }]);
    } catch {
      setMessages((prev) => [...prev, { id: Date.now().toString(), sender: 'ai', text: 'Sorry, I failed to process your request.' }]);
    } finally {
      setLoading(false);
    }
  };

  const renderBubble = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}>
        {!isUser && <Image source={require('../../assets/icon.png')} style={styles.avatar} />}
        <View style={styles.bubbleContainer}>
          {item.actionExecuted ? (
            <View style={styles.actionCard}>
              <View style={styles.actionHeader}>
                <View style={styles.checkIcon}><Feather name="check" size={16} color="#FFF" /></View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.actionTitle}>Scheduled: Task</Text>
                  <Text style={styles.actionSub}>Action completed successfully.</Text>
                </View>
                <Feather name="calendar" size={20} color="#10B981" />
              </View>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>View in Tasks</Text>
                <Feather name="arrow-right" size={16} color="#4F46E5" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
              <Text style={[styles.bubbleText, isUser ? styles.userText : styles.aiText]}>{item.text}</Text>
            </View>
          )}
          <Text style={[styles.timestamp, isUser ? styles.userTime : styles.aiTime]}>9:41 AM</Text>
        </View>
        {isUser && <View style={[styles.avatar, styles.userAvatarPlaceholder]}><Feather name="user" size={18} color="#FFF" /></View>}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation?.goBack()}><Feather name="chevron-left" size={24} color="#111827" /></TouchableOpacity>
        <Image source={require('../../assets/icon.png')} style={styles.headerAvatar} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>StudyBuddy AI Assistant</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.headerSub}>Powered by Pinecone RAG & Function Calling</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.iconBtn}><Feather name="more-horizontal" size={24} color="#4F46E5" /></TouchableOpacity>
      </View>

      <FlatList data={messages} keyExtractor={(item) => item.id} renderItem={renderBubble} contentContainerStyle={styles.messageList} />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#4F46E5" />
          <Text style={styles.loadingText}>AI is thinking...</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.attachBtn}><Feather name="paperclip" size={20} color="#6B7280" /></TouchableOpacity>
          <TextInput style={styles.input} placeholder="Ask a question or schedule a task..." value={input} onChangeText={setInput} multiline />
          <TouchableOpacity style={[styles.sendBtn, !input.trim() && { opacity: 0.5 }]} onPress={sendMessage}>
            <Feather name="send" size={18} color="#FFF" style={{ marginLeft: -2, marginTop: 2 }} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: 16, paddingHorizontal: 16, backgroundColor: '#FAFAFA' },
  iconBtn: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 20 },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, marginHorizontal: 12, backgroundColor: '#E0E7FF' },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 6 },
  headerSub: { fontSize: 11, color: '#6B7280' },
  messageList: { padding: 16 },
  messageRow: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-end' },
  userRow: { justifyContent: 'flex-end' },
  aiRow: { justifyContent: 'flex-start' },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E0E7FF', marginBottom: 20 },
  userAvatarPlaceholder: { backgroundColor: '#111827', alignItems: 'center', justifyContent: 'center' },
  bubbleContainer: { maxWidth: '75%', marginHorizontal: 8 },
  bubble: { padding: 14, borderRadius: 20 },
  userBubble: { backgroundColor: '#4F46E5', borderBottomRightRadius: 4 },
  aiBubble: { backgroundColor: '#F3F4F6', borderBottomLeftRadius: 4 },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#FFF' },
  aiText: { color: '#111827' },
  timestamp: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
  userTime: { alignSelf: 'flex-end' },
  aiTime: { alignSelf: 'flex-start' },
  actionCard: { backgroundColor: '#ECFDF5', borderRadius: 16, padding: 16, minWidth: 240 },
  actionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  checkIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  actionTitle: { fontSize: 14, fontWeight: 'bold', color: '#111827' },
  actionSub: { fontSize: 12, color: '#4B5563', marginTop: 2 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 10, borderRadius: 20 },
  actionBtnText: { color: '#4F46E5', fontWeight: 'bold', fontSize: 13, marginRight: 6 },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  loadingText: { fontSize: 13, color: '#6B7280', marginLeft: 8 },
  inputContainer: { padding: 16, backgroundColor: '#FAFAFA' },
  inputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 28, paddingHorizontal: 6, paddingVertical: 6, borderWidth: 1, borderColor: '#F3F4F6', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  attachBtn: { padding: 10 },
  input: { flex: 1, fontSize: 15, color: '#111827', paddingVertical: 8, maxHeight: 100 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#4F46E5', alignItems: 'center', justifyContent: 'center' },
});