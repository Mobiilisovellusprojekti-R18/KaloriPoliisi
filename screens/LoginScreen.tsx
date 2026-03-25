import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/Config';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Virhe', 'Täytä sähköposti ja salasana!');
      return;
    }

    setLoading(true);
    try {
      // Kirjaudutaan sisään Firebase Authenticationilla
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Kirjauduttu sisään käyttäjällä:', userCredential.user.email);
      
      Alert.alert('Onnistui', 'Olet nyt kirjautunut sisään!');
      
      // Tässä kohtaa normaalisti ohjattaisiin käyttäjä sovelluksen päänäkymään (esim. Etusivulle/Kojelaudalle)
      
    } catch (error: any) {
      console.error(error);
      Alert.alert('Kirjautuminen epäonnistui', 'Tarkista sähköposti ja salasana.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kirjaudu sisään</Text>

      <TextInput
        style={styles.input}
        placeholder="Sähköposti"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Salasana"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button 
        title={loading ? "Kirjaudutaan..." : "Kirjaudu"} 
        onPress={handleLogin} 
        disabled={loading} 
      />

      <View style={styles.spacer} />

      <Button 
  title="Eikö sinulla ole tiliä? Rekisteröidy" 
  onPress={() => navigation.navigate('Register')} 
  color="#888"
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  spacer: {
    height: 20,
  }
});

export default LoginScreen;