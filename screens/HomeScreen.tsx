import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/Config';

const HomeScreen = () => {

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Uloskirjautuminen epäonnistui', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tervetuloa KaloriPoliisiin!</Text>
      
      {/* Tällä napilla saadaan myös "#3 Uloskirjautuminen" tehtyä valmiiksi! */}
      <Button title="Kirjaudu ulos" onPress={handleLogout} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  }
});

export default HomeScreen;