// app/(main)/favorites.tsx
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
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';

export default function Favorites() {
  const router = useRouter();
  const { colors, theme } = useTheme();

  // Search state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Search Players API
  // Favorite players from AsyncStorage
  const [favoritePlayers, setFavoritePlayers] = useState<any[]>([]);

  // Load favorites when page is focused
  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    const stored = await AsyncStorage.getItem("favorites");
    setFavoritePlayers(stored ? JSON.parse(stored) : []);
  };

  // 🔍 Search API
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
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.header }]}> 
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={28} color={colors.icon} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Favourites</Text>
        <View style={{ width: 28 }} />
      </View>
      {/* Search Input */}
      <View style={[styles.searchBox, { backgroundColor: colors.card, shadowColor: colors.border }]}> 
        <Feather name="search" size={18} color={colors.textSecondary} style={{ marginRight: 10 }} />
        <TextInput
          placeholder="Search players..."
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.text }]}
          value={query}
          onChangeText={searchPlayers}
        />
      </View>
      {/* Loading Spinner */}
      {loading && (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 10 }} />
      )}
      {/* Search Results */}
      {results.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Search Results</Text>
          <View style={styles.list}>
            {results.map((player) => (
              <TouchableOpacity
                key={player.idPlayer}
                style={[styles.playerCard, { backgroundColor: colors.card, shadowColor: colors.border }]}
                onPress={() => openPlayerProfile(player.idPlayer)}
              >
                <Image
                  source={{ uri: player.strThumb || player.strCutout || undefined }}
                  style={styles.playerPhoto}
                />
                <View style={styles.playerInfo}>
                  <Text style={[styles.playerName, { color: colors.text }]}>{player.strPlayer}</Text>
                  <Text style={[styles.role, { color: colors.textSecondary }]}>{player.strNationality}</Text>
                </View>
                <Feather name="arrow-right" size={22} color={colors.primary} />
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
      {/* Show message if no search */}
      {/* No search results */}
      {!loading && query.length >= 2 && results.length === 0 && (
        <Text style={[styles.noResult, { color: colors.textSecondary }]}>No players found</Text>
      )}
      {/* Divider */}
      <View style={{ height: 20 }} />
      {/* Favorite Players Section */}
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Saved Favorites</Text>
      {favoritePlayers.length === 0 && (
        <Text style={[styles.noResult, { color: colors.textSecondary }]}>No favorites added yet.</Text>
      )}
      <View style={styles.list}>
        {favoritePlayers.map((player) => (
          <TouchableOpacity
            key={player.idPlayer}
            style={[styles.playerCard, { backgroundColor: colors.card, shadowColor: colors.border }]}
            onPress={() => openPlayerProfile(player.idPlayer)}
          >
            <Image
              source={{ uri: player.thumb }}
              style={styles.playerPhoto}
            />
            <View style={styles.playerInfo}>
              <Text style={[styles.playerName, { color: colors.text }]}>{player.name}</Text>
              <Text style={[styles.role, { color: colors.textSecondary }]}>{player.position} | {player.team}</Text>
            </View>
            <Feather name="arrow-right" size={22} color={colors.primary} />
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

/* ========= STYLES ========= */
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

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },

  input: {
    flex: 1,
    fontSize: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 10,
  },

  list: {
    paddingHorizontal: 20,
  },

  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
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

  playerName: { fontSize: 16, fontWeight: 'bold' },

  role: { fontSize: 13, marginTop: 2 },

  noResult: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 16,
  },
});