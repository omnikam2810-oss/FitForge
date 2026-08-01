import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { AppShell } from '../components/ui/AppShell';
import { useTheme } from '../theme/ThemeProvider';
import { getFeed, CommunityPost } from '../api/community.api';

export const CommunityScreen: React.FC = () => {
  const { theme } = useTheme();
  const [feed, setFeed] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeed = async () => {
      setLoading(true);
      try {
        const data = await getFeed();
        setFeed(data);
      } catch (err: any) {
        setError(err?.message ?? 'Unable to load community feed');
      } finally {
        setLoading(false);
      }
    };

    loadFeed();
  }, []);

  return (
    <AppShell title="Community" subtitle="Stay motivated with others">
      {loading ? (
        <ActivityIndicator color={theme.colors.brand.primary} style={{ marginTop: 24 }} />
      ) : error ? (
        <Text style={[theme.typography.body, { color: theme.colors.feedback.error, marginTop: 24 }]}>{error}</Text>
      ) : feed.length ? (
        <FlatList
          data={feed}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
              <Text style={[theme.typography.h3, { color: theme.colors.brand.primary }]}>{item.userName}</Text>
              <Text style={[theme.typography.body, { color: theme.colors.text.primary, marginTop: 8 }]}>{item.content}</Text>
              <Text style={[theme.typography.bodySmall, { color: theme.colors.text.secondary, marginTop: 6 }]}>{item.likes} likes • {item.comments} comments</Text>
            </View>
          )}
        />
      ) : (
        <View style={[styles.card, { backgroundColor: theme.colors.surface.card, borderColor: theme.colors.border.default }]}> 
          <Text style={[theme.typography.h3, { color: theme.colors.brand.secondary }]}>No community posts yet</Text>
          <Text style={[theme.typography.body, { color: theme.colors.text.primary, marginTop: 8 }]}>Check back later for workout highlights and coach tips.</Text>
        </View>
      )}
    </AppShell>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
});
