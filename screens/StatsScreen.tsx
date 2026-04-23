import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { auth, firestore } from '../firebase/Config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import BottomMenu from '../components/BottomMenu';

const screenWidth = Dimensions.get('window').width;

const StatsScreen = () => {
  const [weeklyData, setWeeklyData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const getLast7Days = () => {
    const days = ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'];
    const today = new Date();

    const last7Dates: string[] = [];
    const last7Labels: string[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const isoDate = d.toISOString().split('T')[0];
      last7Dates.push(isoDate);
      last7Labels.push(days[d.getDay()]);
    }

    return { last7Dates, last7Labels };
  };

  useFocusEffect(
    useCallback(() => {
      const fetchWeeklyStats = async () => {
        setLoading(true);

        const user = auth.currentUser;
        if (!user) {
          setWeeklyData([]);
          setLabels([]);
          setLoading(false);
          return;
        }

        try {
          const { last7Dates, last7Labels } = getLast7Days();

          const q = query(
            collection(firestore, 'dailyFoods'),
            where('userId', '==', user.uid)
          );

          const snapshot = await getDocs(q);

          const dailyTotals: Record<string, number> = {};

          last7Dates.forEach((date) => {
            dailyTotals[date] = 0;
          });

          snapshot.forEach((doc) => {
            const data = doc.data();

            if (
              typeof data.date === 'string' &&
              dailyTotals[data.date] !== undefined
            ) {
              dailyTotals[data.date] += Number(data.calories) || 0;
            }
          });

          const finalData = last7Dates.map((date) => dailyTotals[date]);

          setLabels(last7Labels);
          setWeeklyData(finalData);
        } catch {
          setLabels([]);
          setWeeklyData([]);
        } finally {
          setLoading(false);
        }
      };

      fetchWeeklyStats();
    }, [])
  );

  const hasZero = weeklyData.some((value) => value === 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Viikon kaloriseuranta</Text>

        <View style={styles.card}>
          {loading ? (
            <ActivityIndicator size="large" color="#00C853" />
          ) : weeklyData.length === 0 ? (
            <Text style={styles.emptyText}>Ei vielä dataa tältä viikolta.</Text>
          ) : (
            <LineChart
              data={{
                labels,
                datasets: [
                  {
                    data: weeklyData,
                    color: () => '#000000',
                    strokeWidth: 2,
                  },
                ],
              }}
              width={screenWidth - 40}
              height={280}
              yAxisLabel=""
              yAxisSuffix=" kcal"
              fromZero={hasZero}
              segments={4}
              withDots
              withShadow={false}
              withInnerLines
              withOuterLines={false}
              withVerticalLines={false}
              bezier
              chartConfig={{
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: () => '#000000',
                labelColor: () => '#555',
                propsForDots: {
                  r: '5',
                  strokeWidth: '2',
                  stroke: '#00C853',
                  fill: '#00C853',
                },
                propsForBackgroundLines: {
                  stroke: '#eeeeee',
                  strokeDasharray: '',
                },
                propsForLabels: {
                  fontSize: 11,
                },
              }}
              style={styles.chart}
            />
          )}
        </View>
      </View>

      <BottomMenu />
    </SafeAreaView>
  );
};

export default StatsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingTop: 10,
    paddingBottom: 90,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    elevation: 3,
    width: '94%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 320,
  },
  chart: {
    borderRadius: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});