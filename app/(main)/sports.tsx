import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Sports() {
  const router = useRouter();

  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH SPORTS FROM API
  const fetchSports = async () => {
    try {
      const res = await fetch('https://www.thesportsdb.com/api/v2/json/3/all_sports');
      const data = await res.json();

      setSports(data?.sports || []);
      setLoading(false);
    } catch (error) {
      console.log("❌ Error fetching sports:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Sports</Text>
        <TouchableOpacity>
          <Feather name="search" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.topSpacing} />

      {/* LOADING INDICATOR */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 30 }} />
      ) : (
        <View style={styles.grid}>
          {sports.map((sport: any, index) => (
            <TouchableOpacity key={index} style={styles.card} activeOpacity={0.7}>
              <Feather name="activity" size={40} color="#007AFF" />

              <Text style={styles.sportName}>{sport.strSport}</Text>

              <Text style={styles.matches}>
                Format: {sport.strFormat || "N/A"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },

  title: { fontSize: 24, fontWeight: 'bold', color: '#000' },

  topSpacing: {
    height: 40,
    backgroundColor: '#f8f9fa',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 16,
  },

  card: {
    width: '46%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },

  sportName: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },

  matches: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
