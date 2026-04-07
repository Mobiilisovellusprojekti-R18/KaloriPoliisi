import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/Config';

const HomeScreen = ({ navigation }: any) => {

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

      <View style={styles.buttonContainer}>
        <Button
          title="Muokkaa profiilia"
          onPress={() => navigation.navigate('Profile')}
          color="#007AFF"
        />
      </View>

      {/* Tällä napilla saadaan myös "#3 Uloskirjautuminen" tehtyä valmiiksi! */}
      <View style={styles.buttonContainer}>
        <Button title="Kirjaudu ulos" onPress={handleLogout} color="red" />
      </View>
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
  },
  buttonContainer: {
    marginVertical: 10,
    width: 200,
  }
});

export default HomeScreen;