import { useAuth } from '@/src/providers/AuthProvider';
import { listConversations, type Conversation } from '@/src/services/chat';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user, initializing } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await listConversations();
      setConversations(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (initializing) return;
    if (!user) {
      router.replace('/auth/register');
    } else {
      fetchData();
    }
  }, [initializing, user, fetchData]);

  const onOpenConversation = (id: string) => {
    router.push({ pathname: '/modal', params: { id } });
  };

  if (!user) return null;

  return (
    <FlatList
      data={conversations}
      keyExtractor={(c) => c._id}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.row} onPress={() => onOpenConversation(item._id)}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title} numberOfLines={1}>
              {item.participants.map((p) => p.name).join(', ')}
            </Text>
            {!!item.lastMessage && (
              <Text style={styles.subtitle} numberOfLines={1}>
                {item.lastMessage.content}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={!loading ? <Text style={styles.empty}>No conversations</Text> : null}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: { fontSize: 16, fontWeight: '600', color: '#111' },
  subtitle: { fontSize: 12, color: '#666', marginTop: 2 },
  empty: { textAlign: 'center', marginTop: 40, color: '#666' },
});
