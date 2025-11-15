import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Favorites() {
  const router = useRouter();

  // Search state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Search Players API
  const searchPlayers = async (text: string) => {
    setQuery(text);

    if (text.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
       `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(text)}`
      );
      const data = await res.json();

      setResults(data?.player || []);
    } catch (error) {
      console.log('❌ Search error:', error);
    }
    setLoading(false);
  };

  const openPlayerProfile = (id: string) => {
    router.push(`/player-profile/${id}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={28} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Favourites</Text>

        <TouchableOpacity>
          <Feather name="more-vertical" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <Feather name="search" size={18} color="#666" style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Search players..."
          style={styles.input}
          value={query}
          onChangeText={searchPlayers}
        />
      </View>

      {/* Loading Spinner */}
      {loading && <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 10 }} />}

      {/* Search Results */}
      {results.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Search Results</Text>

          <View style={styles.list}>
            {results.map((player) => (
              <TouchableOpacity
                key={player.idPlayer}
                style={styles.playerCard}
                onPress={() => openPlayerProfile(player.idPlayer)}
              >
                <Image
                  source={{ uri: player.strThumb || player.strCutout || undefined }}
                  style={styles.playerPhoto}
                />

                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{player.strPlayer}</Text>
                  <Text style={styles.role}>{player.strNationality}</Text>
                </View>

                <Feather name="arrow-right" size={22} color="#007AFF" />
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Show message if no search */}
      {!loading && query.length >= 2 && results.length === 0 && (
        <Text style={styles.noResult}>No players found</Text>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

/* ==== STYLES ==== */
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

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 10,
    color: '#000',
  },

  list: {
    paddingHorizontal: 20,
  },

  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
  },

  playerPhoto: {
    width: 55,
    height: 55,
    borderRadius: 30,
    marginRight: 15,
    backgroundColor: '#eee',
  },

  playerInfo: { flex: 1 },

  playerName: { fontSize: 16, fontWeight: 'bold', color: '#000' },

  role: { fontSize: 13, color: '#666', marginTop: 2 },

  noResult: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16,
  },
});
