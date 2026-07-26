import 'react-native-gesture-handler';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Outfit_400Regular,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';

const customFonts = {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Outfit_400Regular,
  Outfit_600SemiBold,
  Outfit_700Bold,
};

import { store } from './src/store/store';
import { ThemeProvider, useTheme } from './src/theme/ThemeProvider';
import { HomeScreen } from './src/screens/HomeScreen';
import { WorkoutsScreen } from './src/screens/WorkoutsScreen';
import { ProgramsScreen } from './src/screens/ProgramsScreen';
import { ProgressScreen } from './src/screens/ProgressScreen';
import { CommunityScreen } from './src/screens/CommunityScreen';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { OnboardingFlowScreen } from './src/screens/OnboardingFlowScreen';
import { WorkoutFlowScreen } from './src/screens/WorkoutFlowScreen';
import { TabBar } from './src/components/ui/TabBar';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const RootNavigator = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'workouts':
        return <WorkoutFlowScreen />;
      case 'programs':
        return <ProgramsScreen />;
      case 'progress':
        return <ProgressScreen />;
      case 'community':
        return <CommunityScreen />;
      case 'onboarding':
        return <OnboardingFlowScreen />;
      case 'home':
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surface.bg }]}> 
      <View style={styles.content}>{renderScreen()}</View>
      <TabBar activeTab={activeTab} onChange={setActiveTab} />
    </SafeAreaView>
  );
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(customFonts);
        
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider>
        <SafeAreaProvider>
          <View style={styles.appContainer} onLayout={onLayoutRootView}>
            <RootNavigator />
          </View>
        </SafeAreaProvider>
      </ThemeProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
