import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function Sports() {
  const router = useRouter();
  const { colors } = useTheme();

  const [sports, setSports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSports = async () => {
    try {
      const res = await fetch("https://www.thesportsdb.com/api/v1/json/3/all_sports.php");
      const data = await res.json();

      setSports(data?.sports || []);
    } catch (error) {
      console.log("❌ Error fetching sports:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSports();
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.header }]}> 
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={28} color={colors.icon} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Sports</Text>
        <TouchableOpacity>
          <Feather name="search" size={28} color={colors.icon} />
        </TouchableOpacity>
      </View>

      <View style={{ height: 20 }} />

      {/* Loading */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <View style={styles.grid}>
          {sports.map((sport: any, index) => (
            <TouchableOpacity key={index} style={[styles.card, { backgroundColor: colors.card }]} activeOpacity={0.8}>
              
              <Image
                source={{ uri: sport.strSportThumb }}
                style={styles.sportImage}
              />

              <Text style={[styles.sportName, { color: colors.text }]}>{sport.strSport}</Text>
              <Text style={[styles.format, { color: colors.textSecondary }]}>{sport.strFormat}</Text>

            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },

  title: { fontSize: 24, fontWeight: 'bold' },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },

  card: {
    width: '46%',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },

  sportImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: 'cover',
    marginBottom: 10,
    backgroundColor: '#eee'
  },

  sportName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  format: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
  },
});
