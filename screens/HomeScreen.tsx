import { useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { auth, firestore } from '../firebase/Config';
import { doc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const HomeScreen = ({ navigation }: any) => {

  const [calories, setCalories] = useState<number | null>(null);

  const calculateCalories = (
    weight: number,
    height: number,
    age: number,
    gender: string,
    activity: number
  ) => {
    let bmr;
    
    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

  return Math.round(bmr * activity);
};

const fetchUserData = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const docRef = doc(firestore, 'users', user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();

    const result = calculateCalories(
      data.weight,
      data.height,
      data.age,
      data.gender,
      data.activity
    );

    setCalories(result);
  }
}

  const caloriesEaten = 1800; // TESTIDATA, VOI POISTAA KUN KALORIEN LISÄYS TEHTY

  useFocusEffect(
    useCallback(() => {
      const fetchUserData = async () => {
        const user = auth.currentUser;
        
        if (!user) return;
      
        const docRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(docRef);
      
        if (docSnap.exists()) {
          const data = docSnap.data();
        
          const result = calculateCalories(
            data.weight,
            data.height,
            data.age,
            data.gender,
            data.activity
          );
          
          setCalories(result);
        }
      };
    
    fetchUserData();
  }, [])
);

  return (
    <View style={styles.container}>
      {calories ? (
        <View style={styles.card}>
          <Text style={styles.label}>Kaloritavoite:</Text>
          <Text style={styles.calorieText}>
            {caloriesEaten} / {calories} kcal
          </Text>

          <View style={styles.barBackground}>
            <View
              style={[
                styles.barFill,
                { width: `${(caloriesEaten / calories) * 100}%` },
              ]}
            />
          </View>
        </View>
      ) : (
        <Text>Ladataan...</Text>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Muokkaa profiilia"
            onPress={() => navigation.navigate('Profile')}
          color="#007AFF"
          />
        </View>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 10,
    width: 200,
  },
  calories: {
  fontSize: 20,
  marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    width: "90%",
    alignSelf: "center",
    elevation: 3,
  },
  calorieText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  barBackground: {
    height: 12,
    backgroundColor: "#eee",
    borderRadius: 10,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#24af24",
    borderRadius: 10,
  },
  label: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 5,
  },
});

export default HomeScreen;