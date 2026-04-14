import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { auth, firestore } from '../firebase/Config';

const AddFoodScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddFood = async () => {
    if (!auth.currentUser) return;

    if (!name || !calories) {
      Alert.alert('Virhe', 'Täytä kaikki kentät');
      return;
    }

    setLoading(true);

    try {
      const today = new Date().toISOString().split('T')[0];

      await addDoc(collection(firestore, 'dailyFoods'), {
        userId: auth.currentUser.uid,
        name: name,
        calories: Number(calories),
        date: today,
        createdAt: new Date(),
      });

      Alert.alert('Tuote lisätty');
      setName('');
      setCalories('');
      navigation.goBack();
    } catch (error) {
      console.error('Virhe tuotteen lisäyksessä:', error);
      Alert.alert('Virhe', 'Tuotteen lisääminen epäonnistui');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lisää tuote</Text>

      <Text style={styles.label}>Tuotteen nimi</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Esim. Banaani"
      />

      <Text style={styles.label}>Kalorit</Text>
      <TextInput
        style={styles.input}
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
        placeholder="Esim. 100"
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddFood}
        disabled={loading}
      >
        <Text style={styles.addButtonText}>
            {loading ? "Tallennetaan..." : "Lisää tuote"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddFoodScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
  addButton: {
  backgroundColor: "#00C853",
  padding: 15,
  borderRadius: 10,
  alignItems: "center",
  marginTop: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});