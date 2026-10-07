import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ListRenderItem } from 'react-native';
import apiClient from '../api/client';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  actionExecuted?: boolean;
}

export default function AIChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Hello! I am your StudyBuddy AI Tutor. Ask me anything about your notes or tell me to schedule a task!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    const promptText = input;
    setInput('');
    setLoading(true);

    try {
      const response = await apiClient.post('/ai/chat', { message: promptText });
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: response.data.reply,
        actionExecuted: response.data.actionExecuted,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'ai', text: 'Sorry, I failed to process your request.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderBubble: ListRenderItem<Message> = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.bubbleText, isUser ? styles.userText : styles.aiText]}>
          {item.text}
        </Text>
        {item.actionExecuted && (
          <View style={styles.actionBadge}>
            <Text style={styles.actionBadgeText}>✓ Task Created in Database</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Tutor Chat 🤖</Text>
        <Text style={styles.headerSub}>Powered by Gemini 2.5 Flash & Pinecone</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderBubble}
        contentContainerStyle={styles.messageList}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#4F46E5" />
          <Text style={styles.loadingText}>Gemini is thinking & searching notes...</Text>
        </View>
      )}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask a question or add a task..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendBtnText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  headerSub: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  messageList: { padding: 20, paddingBottom: 10 },
  bubble: { padding: 14, borderRadius: 16, marginBottom: 12, maxWidth: '80%' },
  userBubble: { backgroundColor: '#4F46E5', alignSelf: 'flex-end', borderBottomRightRadius: 2 },
  aiBubble: { backgroundColor: '#FFFFFF', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#E5E7EB', borderBottomLeftRadius: 2 },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#FFFFFF' },
  aiText: { color: '#1F2937' },
  actionBadge: { marginTop: 8, backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  actionBadgeText: { color: '#065F46', fontSize: 11, fontWeight: 'bold' },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 8 },
  loadingText: { fontSize: 12, color: '#6B7280', marginLeft: 8 },
  inputRow: { flexDirection: 'row', padding: 16, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#F3F4F6', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, fontSize: 15, marginRight: 10 },
  sendBtn: { backgroundColor: '#4F46E5', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20 },
  sendBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
});