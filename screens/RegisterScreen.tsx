import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
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
  const [gender, setGender] = useState("");
  const [activity, setActivity] = useState(1.55);

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
        gender: gender,        
        activity: activity,
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

      <Text style={{ marginBottom: 5 }}>Sukupuoli:</Text>

      <View style={{ flexDirection: "row", marginBottom: 15 }}>
        <TouchableOpacity
          style={[styles.button,gender === "male" && styles.selected]}
          onPress={() => setGender("male")}
        >
          <Text style={styles.buttonText}>Mies</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button,gender === "female" && styles.selected]}
          onPress={() => setGender("female")}
        >
          <Text style={styles.buttonText}>Nainen</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ marginBottom: 5 }}>Aktiivisuustaso:</Text>
      
      <TouchableOpacity
        style={[styles.button, activity === 1.2 && styles.selected]}
        onPress={() => setActivity(1.2)}
      >
        <Text style={styles.buttonText}>Vähän liikuntaa (0-2 krt/vko)</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, activity === 1.55 && styles.selected]}
        onPress={() => setActivity(1.55)}
      >
        <Text style={styles.buttonText}>Normaali (2-4 krt/vko)</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.button, activity === 1.8 && styles.selected]}
        onPress={() => setActivity(1.8)}
      >
        <Text style={styles.buttonText}>Aktiivinen (5-7 krt/vko)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.registerButtonText}>
          {loading ? "Ladataan..." : "Rekisteröidy"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        style={{ marginTop: 8 }}
      >
        <Text style={{ textAlign: "center", color: "#000" }}>
          Onko sinulla jo tili? Kirjaudu tästä
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
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
    borderColor: '#888',
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  button: {
    padding: 8,
    backgroundColor: "#888",
    borderRadius: 5,
    marginRight: 8,
    marginBottom: 8,
    alignItems: "center",
  },

  selected: {
    backgroundColor: "green",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  registerButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
   marginTop: 10,
  },

  registerButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  }
});

export default RegisterScreen;