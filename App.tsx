import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase/Config';

// Tuodaan sivut
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import AddFoodScreen from './screens/AddFoodScreen';
import FoodDiaryScreen from './screens/FoodDiaryScreen';
import StatsScreen from './screens/StatsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  // Tämä kuuntelee, kirjautuuko käyttäjä sisään tai ulos
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* JOS KÄYTTÄJÄ ON KIRJAUTUNUT: Näytetään vain Etusivu */}
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'KaloriPoliisi' }}
            />
            <Stack.Screen
              name="FoodDiary"
              component={FoodDiaryScreen}
              options={{ title: 'Ruokapäiväkirja' }}
            />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: 'Profiili' }}
            />
            <Stack.Screen
              name="AddFood"
              component={AddFoodScreen}
              options={{ title: 'Lisää tuote' }}
            />
            <Stack.Screen 
              name="Stats"
              component={StatsScreen}
              options={{ title: 'Tilastot' }} 
            />
          </>
        ) : (
          /* JOS EI OLE KIRJAUTUNUT: Näytetään Kirjautuminen ja Rekisteröityminen */
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ title: 'Kirjaudu sisään' }} 
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ title: 'Rekisteröidy' }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}