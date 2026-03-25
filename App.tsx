import { StyleSheet, Text, View } from 'react-native';
import { firestore } from './firebase/Config';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>KaloriPoliisi</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
