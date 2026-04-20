import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { auth, firestore } from '../firebase/Config';
import { collection, getDocs, orderBy, query, where, limit } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import BottomMenu from '../components/BottomMenu';

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  date: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fi-FI', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  });
};

const FoodDiaryScreen = () => {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchEntries = async () => {
        setLoading(true);

        const user = auth.currentUser;
        if (!user) {
          setEntries([]);
          setLoading(false);
          return;
        }

        try {
          const q = query(
            collection(firestore, 'dailyFoods'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(50)
          );

          const snapshot = await getDocs(q);
          const loadedEntries: FoodEntry[] = snapshot.docs
            .map((doc) => {
              const data = doc.data();
              return {
                id: doc.id,
                name: data.name,
                calories: data.calories,
                date: data.date,
              };
            })
            .filter((entry) => entry.date);

          setEntries(loadedEntries);
        } catch (error) {
          console.error('Virhe ruokapäiväkirjan lataamisessa:', error);
          setEntries([]);
        } finally {
          setLoading(false);
        }
      };

      fetchEntries();
    }, [])
  );

  const groupedEntries = entries.reduce((groups: Record<string, FoodEntry[]>, entry) => {
    if (!groups[entry.date]) {
      groups[entry.date] = [];
    }
    groups[entry.date].push(entry);
    return groups;
  }, {});

  const dates = Object.keys(groupedEntries).sort((a, b) => (a < b ? 1 : -1));

  const renderDays = () => {
    if (dates.length === 0) {
      return <Text style={styles.emptyText}>Ei merkintöjä viimeisiltä päiviltä.</Text>;
    }

    return dates.map((date) => {
      const dayEntries = groupedEntries[date];
      const total = dayEntries.reduce((sum, item) => sum + item.calories, 0);

      return (
        <View key={date} style={styles.dayCard}>
          <View style={styles.dayHeader}>
            <Text style={styles.dayTitle}>{formatDate(date)}</Text>
            <Text style={styles.dayTotal}>{total} kcal</Text>
          </View>
          {dayEntries.map((item) => (
            <View key={item.id} style={styles.entryRow}>
              <Text style={styles.entryName}>{item.name}</Text>
              <Text style={styles.entryCalories}>{item.calories} kcal</Text>
            </View>
          ))}
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ruokapäiväkirja</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00C853" style={styles.loader} />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.subtitle}>Viimeisimmät kalorimerkinnät</Text>
          {renderDays()}
        </ScrollView>
      )}
      <BottomMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingBottom: 110,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  loader: {
    marginTop: 40,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  dayCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dayTotal: {
    fontSize: 16,
    color: '#24af24',
    fontWeight: 'bold',
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  entryName: {
    fontSize: 16,
  },
  entryCalories: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default FoodDiaryScreen;
