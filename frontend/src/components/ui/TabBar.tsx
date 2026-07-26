import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';

interface TabBarProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

const tabs = [
  { key: 'home', label: 'Home' },
  { key: 'workouts', label: 'Workouts' },
  { key: 'programs', label: 'Programs' },
  { key: 'progress', label: 'Progress' },
  { key: 'community', label: 'Community' },
  { key: 'onboarding', label: 'Profile' },
];

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onChange }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.elevated, borderTopColor: theme.colors.border.light }]}> 
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="button"
            onPress={() => onChange(tab.key)}
            style={styles.tab}
          >
            <Text
              style={[
                theme.typography.label,
                {
                  color: isActive ? theme.colors.brand.primary : theme.colors.text.secondary,
                  fontWeight: isActive ? '700' : '500',
                },
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  tab: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
});
