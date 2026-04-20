import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateEmail, signOut } from 'firebase/auth';
import { auth, firestore } from '../firebase/Config';
import BottomMenu from '../components/BottomMenu';

interface UserProfile {
  email: string;
  age: number;
  height: number;
  weight: number;
  gender: 'male' | 'female';
  activity: number;
}

const ProfileScreen = ({ navigation }: any) => {
  const [profile, setProfile] = useState<UserProfile>({
    email: '',
    age: 0,
    height: 0,
    weight: 0,
    gender: 'male',
    activity: 1.55,
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
          weight: userData.weight || 0,
          gender: userData.gender || 'male',
          activity: userData.activity || 1.55,
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
        weight: profile.weight,
        gender: profile.gender,
        activity: profile.activity,
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Uloskirjautuminen epäonnistui', error);
      Alert.alert('Virhe', 'Uloskirjautuminen epäonnistui');
    }
  };

  return (
    <View style={styles.screenContainer}>
      <ScrollView contentContainerStyle={styles.container}>
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

        <Text style={styles.label}>Sukupuoli</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.selectButton, profile.gender === 'male' && styles.selected]}
            onPress={() => setProfile({ ...profile, gender: 'male' })}
          >
            <Text style={styles.selectButtonText}>Mies</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.selectButton, profile.gender === 'female' && styles.selected]}
            onPress={() => setProfile({ ...profile, gender: 'female' })}
          >
            <Text style={styles.selectButtonText}>Nainen</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Aktiivisuustaso</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.selectButton, profile.activity === 1.2 && styles.selected]}
            onPress={() => setProfile({ ...profile, activity: 1.2 })}
          >
            <Text style={styles.selectButtonText}>Vähän</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.selectButton, profile.activity === 1.55 && styles.selected]}
            onPress={() => setProfile({ ...profile, activity: 1.55 })}
          >
            <Text style={styles.selectButtonText}>Normaali</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.selectButton, profile.activity === 1.8 && styles.selected]}
            onPress={() => setProfile({ ...profile, activity: 1.8 })}
          >
            <Text style={styles.selectButtonText}>Aktiivinen</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={loading ? "Päivitetään..." : "Tallenna muutokset"}
            onPress={handleUpdateProfile}
            disabled={loading}
          />
        </View>

        <View style={styles.buttonContainer}> 
          <Button
            title="Kirjaudu ulos"
            onPress={handleLogout}
            color="red"
          />
        </View>
      </ScrollView>
      <BottomMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    paddingBottom: 120,
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
    marginTop: 0,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
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
    marginTop: 10,
    marginBottom: 10,
  },
  row: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginBottom: 10,
  },
  selectButton: {
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 6,
    marginRight: 10,
    marginBottom: 10,
  },
  selected: {
    backgroundColor: 'green',
  },
  selectButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;