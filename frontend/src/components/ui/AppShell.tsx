import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface AppShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  scrollable?: boolean;
}

export const AppShell: React.FC<AppShellProps> = ({ title, subtitle, children, actions, scrollable = true }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.bg }]}> 
      <View style={styles.header}> 
        <View style={{ flex: 1 }}>
          <Text style={[theme.typography.h2, { color: theme.colors.brand.primary }]}>{title}</Text>
          {subtitle ? <Text style={[theme.typography.bodySmall, { color: theme.colors.text.secondary, marginTop: 4 }]}>{subtitle}</Text> : null}
        </View>
        {actions ? <View>{actions}</View> : null}
      </View>
      {scrollable ? (
        <ScrollView contentContainerStyle={styles.content}>{children}</ScrollView>
      ) : (
        <View style={styles.content}>{children}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
});
