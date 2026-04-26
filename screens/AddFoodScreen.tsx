import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { auth, firestore } from '../firebase/Config';
import BottomMenu from '../components/BottomMenu';
import { CameraView, useCameraPermissions } from 'expo-camera';

const AddFoodScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [caloriesPer100, setCaloriesPer100] = useState('');
  const [amount, setAmount] = useState('100'); // g tai ml
  const [loading, setLoading] = useState(false);

  const [scannerVisible, setScannerVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const fetchProductFromOpenFoodFacts = async (barcode: string) => {
    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const data = await res.json();

      if (data.status !== 1 || !data.product) {
        Alert.alert('Ei löytynyt', 'Tuotetta ei löytynyt Open Food Factsista.');
        return;
      }

      const product = data.product;
      const productName = product.product_name || product.product_name_fi || '';
      const kcal100 =
        product?.nutriments?.['energy-kcal_100g'] ??
        product?.nutriments?.['energy-kcal'] ??
        null;

      if (productName) setName(productName);

      if (kcal100 !== null && kcal100 !== undefined && !Number.isNaN(Number(kcal100))) {
        setCaloriesPer100(String(Number(kcal100)));
      } else {
        Alert.alert(
          'Huomio',
          'Tuote löytyi, mutta kaloridataa ei löytynyt. Lisää kcal/100 käsin.'
        );
      }
    } catch (error) {
      console.error('OFF-haku epäonnistui:', error);
      Alert.alert('Virhe', 'Tuotteen haku epäonnistui.');
    }
  };

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setScannerVisible(false);
    await fetchProductFromOpenFoodFacts(data);
  };

  const openScanner = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Ei kameran käyttöoikeutta', 'Salli kamera skannausta varten.');
        return;
      }
    }
    setScanned(false);
    setScannerVisible(true);
  };

  const handleAddFood = async () => {
    if (!auth.currentUser) return;

    if (!name || !caloriesPer100 || !amount) {
      Alert.alert('Virhe', 'Täytä kaikki kentät');
      return;
    }

    const kcal100Num = Number(caloriesPer100.replace(',', '.'));
    const amountNum = Number(amount.replace(',', '.'));

    if (Number.isNaN(kcal100Num) || Number.isNaN(amountNum) || kcal100Num < 0 || amountNum <= 0) {
      Alert.alert('Virhe', 'Tarkista arvot: kcal/100 >= 0 ja määrä > 0');
      return;
    }

    const totalCalories = Math.round((kcal100Num * amountNum) / 100);

    setLoading(true);

    try {
      const today = new Date().toISOString().split('T')[0];

      await addDoc(collection(firestore, 'dailyFoods'), {
        userId: auth.currentUser.uid,
        name: name.trim(),
        calories: totalCalories,      
        caloriesPer100: kcal100Num,   
        amount: amountNum,            
        date: today,
        createdAt: new Date(),
      });

      Alert.alert('Tuote lisätty', `Lisätty ${totalCalories} kcal`);
      setName('');
      setCaloriesPer100('');
      setAmount('100');
      navigation.goBack();
    } catch (error) {
      console.error('Virhe tuotteen lisäyksessä:', error);
      Alert.alert('Virhe', 'Tuotteen lisääminen epäonnistui');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Lisää tuote</Text>

        <TouchableOpacity style={styles.scanButton} onPress={openScanner}>
          <Text style={styles.scanButtonText}>Skannaa viivakoodi</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Tuotteen nimi</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Esim. Banaani"
        />

        <Text style={styles.label}>Kalorit (kcal / 100 g/ml)</Text>
        <TextInput
          style={styles.input}
          value={caloriesPer100}
          onChangeText={setCaloriesPer100}
          keyboardType="decimal-pad"
          placeholder="Esim. 42"
        />

        <Text style={styles.label}>Määrä (g/ml)</Text>
        <TextInput
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholder="Esim. 500"
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddFood}
          disabled={loading}
        >
          <Text style={styles.addButtonText}>
            {loading ? 'Tallennetaan...' : 'Lisää tuote'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={scannerVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Skannaa viivakoodi</Text>

          <CameraView
            style={styles.camera}
            facing="back"
            barcodeScannerSettings={{
              barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          />

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setScannerVisible(false)}
          >
            <Text style={styles.closeButtonText}>Sulje</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <BottomMenu />
    </View>
  );
};

export default AddFoodScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  scanButton: {
    backgroundColor: '#1976D2',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  addButton: {
    backgroundColor: '#00C853',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 60,
  },
  modalTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  closeButton: {
    backgroundColor: '#D32F2F',
    margin: 16,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});