import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateEmail } from 'firebase/auth';
import { auth, firestore } from '../firebase/Config';

interface UserProfile {
  email: string;
  age: number;
  height: number;
  weight: number;
}

const ProfileScreen = ({ navigation }: any) => {
  const [profile, setProfile] = useState<UserProfile>({
    email: '',
    age: 0,
    height: 0,
    weight: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    if (!auth.currentUser) return;

    try {
      const userDoc = await getDoc(doc(firestore, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as Omit<UserProfile, 'email'>;
        setProfile({
          email: auth.currentUser.email || '',
          age: userData.age || 0,
          height: userData.height || 0,
          weight: userData.weight || 0
        });
      }
    } catch (error) {
      console.error('Virhe profiilin hakemisessa:', error);
      Alert.alert('Virhe', 'Profiilin lataaminen epäonnistui');
    }
  };

  const handleUpdateProfile = async () => {
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      // Päivitetään Firestore-tiedot
      await updateDoc(doc(firestore, 'users', auth.currentUser.uid), {
        age: profile.age,
        height: profile.height,
        weight: profile.weight
      });

      // Jos sähköposti on muuttunut, päivitetään se Firebase Authissa
      if (profile.email !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, profile.email);
      }

      Alert.alert('Onnistui', 'Profiili päivitetty onnistuneesti!');

    } catch (error: any) {
      console.error('Virhe profiilin päivityksessä:', error);
      Alert.alert('Virhe', error.message || 'Profiilin päivitys epäonnistui');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Muokkaa profiilia</Text>

      <Text style={styles.label}>Sähköposti</Text>
      <TextInput
        style={styles.input}
        value={profile.email}
        onChangeText={(text) => setProfile({...profile, email: text})}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Ikä</Text>
      <TextInput
        style={styles.input}
        value={profile.age.toString()}
        onChangeText={(text) => setProfile({...profile, age: Number(text) || 0})}
        keyboardType="numeric"
        placeholder="Ikä vuosina"
      />

      <Text style={styles.label}>Pituus (cm)</Text>
      <TextInput
        style={styles.input}
        value={profile.height.toString()}
        onChangeText={(text) => setProfile({...profile, height: Number(text) || 0})}
        keyboardType="numeric"
        placeholder="Pituus senttimetreinä"
      />

      <Text style={styles.label}>Paino (kg)</Text>
      <TextInput
        style={styles.input}
        value={profile.weight.toString()}
        onChangeText={(text) => setProfile({...profile, weight: Number(text) || 0})}
        keyboardType="numeric"
        placeholder="Paino kilogrammoina"
      />

      <View style={styles.buttonContainer}>
        <Button
          title={loading ? "Päivitetään..." : "Tallenna muutokset"}
          onPress={handleUpdateProfile}
          disabled={loading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Takaisin"
          onPress={() => navigation.goBack()}
          color="#666"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
});

export default ProfileScreen;