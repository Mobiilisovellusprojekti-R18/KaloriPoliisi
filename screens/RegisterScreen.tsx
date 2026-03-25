import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase/Config'; 

// HUOM: Tässä on lisätty onNavigateToLogin parametriksi
const RegisterScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !age || !height || !weight) {
      Alert.alert('Virhe', 'Täytä kaikki kentät!');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(firestore, 'users', user.uid), {
        email: email,
        age: Number(age),
        height: Number(height),
        weight: Number(weight),
        createdAt: new Date()
      });

      Alert.alert('Onnistui', 'Rekisteröityminen onnistui!');
      

    } catch (error: any) {
      console.error(error);
      Alert.alert('Rekisteröityminen epäonnistui', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Luo uusi tili</Text>

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
      <TextInput
        style={styles.input}
        placeholder="Ikä"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Pituus (cm)"
        value={height}
        onChangeText={setHeight}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Paino (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />

      <Button 
        title={loading ? "Ladataan..." : "Rekisteröidy"} 
        onPress={handleRegister} 
        disabled={loading} 
      />

      {/* TÄHÄN SE TULI! Tämä on uusi nappi, josta pääsee takaisin kirjautumiseen. */}
      <View style={{ height: 20 }} />
      <Button 
  title="Onko sinulla jo tili? Kirjaudu" 
  onPress={() => navigation.navigate('Login')} 
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
});

export default RegisterScreen;