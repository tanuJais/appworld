import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GameProvider } from './src/context/GameContext';
import { StyleSheet } from 'react-native';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import ConceptIntroScreen from './src/screens/ConceptIntroScreen';
import GuidedPracticeScreen from './src/screens/GuidedPracticeScreen';
import RigorousPracticeScreen from './src/screens/RigorousPracticeScreen';
import MasteryLevelScreen from './src/screens/MasteryLevelScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import SettingsScreen from './src/screens/SettingsScreen';

export type RootStackParamList = {
  Home: undefined;
  ConceptIntro: { conceptId: string };
  GuidedPractice: { conceptId: string };
  RigorousPractice: { conceptId: string };
  MasteryLevel: { conceptId: string };
  Progress: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GameProvider>
      <GestureHandlerRootView style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#4F46E5',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Vedic Maths Mastery' }}
          />
          <Stack.Screen 
            name="ConceptIntro" 
            component={ConceptIntroScreen}
            options={{ title: 'Learn Concept' }}
          />
          <Stack.Screen 
            name="GuidedPractice" 
            component={GuidedPracticeScreen}
            options={{ title: 'Guided Practice' }}
          />
          <Stack.Screen 
            name="RigorousPractice" 
            component={RigorousPracticeScreen}
            options={{ title: 'Rigorous Practice' }}
          />
          <Stack.Screen 
            name="MasteryLevel" 
            component={MasteryLevelScreen}
            options={{ title: 'Mastery Level' }}
          />
          <Stack.Screen 
            name="Progress" 
            component={ProgressScreen}
            options={{ title: 'Your Progress' }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{ title: 'Settings' }}
          />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </GestureHandlerRootView>
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
  },
});
