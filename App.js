import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from './src/screens/Onboarding';
import Home from './src/screens/Home';
import Profile from './src/screens/Profile';

const Stack = createNativeStackNavigator();

export default function App() {
  const [state, setState] = useState({
    isLoading: true,
    isOnboardingCompleted: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const savedUser = await AsyncStorage.getItem('user');
        const user = savedUser ? JSON.parse(savedUser) : null;
        setState({
          isLoading: false,
          isOnboardingCompleted: !!user?.isOnboardingCompleted,
        });
      } catch (e) {
        console.error(e);
        setState({ isLoading: false, isOnboardingCompleted: false });
      }
    })();
  }, []);

  if (state.isLoading) {
    return null; // Or a Splash screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={state.isOnboardingCompleted ? 'Home' : 'Onboarding'}
      >
        <Stack.Screen 
          name="Onboarding" 
          component={Onboarding} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Profile" 
          component={Profile} 
          options={{ title: 'Profile' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
