import { SOCKET_URL } from '@/src/config/api';
import { getToken } from '@/src/services/auth';
import { listMessages, sendMessage, type Message } from '@/src/services/chat';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import io, { Socket } from 'socket.io-client';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listMessages(id);
      setMessages(data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    (async () => {
      const token = await getToken();
      const socket = io(SOCKET_URL, { auth: { token } });
      socketRef.current = socket;

      socket.emit('conversation:join', { conversationId: id });
      socket.on('message:new', (msg: Message) => {
        if (msg.conversationId === id) {
          setMessages((prev) => [...prev, msg]);
        }
      });

      return () => {
        socket.disconnect();
      };
    })();
  }, [id]);

  const onSend = async () => {
    if (!text.trim()) return;
    const msg = await sendMessage(id, text.trim());
    setMessages((prev) => [...prev, msg]);
    setText('');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: 'padding' })}>
      <FlatList
        data={messages}
        keyExtractor={(m) => m._id}
        contentContainerStyle={{ padding: 12 }}
        refreshing={loading}
        onRefresh={load}
        renderItem={({ item }) => (
          <View style={styles.bubble}> 
            <Text>{item.content}</Text>
          </View>
        )}
      />
      <View style={styles.composer}>
        <TextInput style={styles.input} value={text} onChangeText={setText} placeholder="Type a message" />
        <Button title="Send" onPress={onSend} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bubble: { padding: 10, backgroundColor: '#f1f1f1', borderRadius: 12, marginBottom: 8, alignSelf: 'flex-start', maxWidth: '85%' },
  composer: { flexDirection: 'row', alignItems: 'center', padding: 8, gap: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#ddd' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8 },
});


