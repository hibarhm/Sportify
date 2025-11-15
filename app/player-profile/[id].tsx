import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function PlayerProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const playerId = Array.isArray(id) ? id[0] : id;

  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPlayer = async () => {
    try {
      const res = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`
      );
      const data = await res.json();

      setPlayer(data?.players?.[0] || null);
    } catch (error) {
      console.log("❌ Error fetching player:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlayer();
  }, [playerId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!player) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18 }}>Player not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Player Profile</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* PLAYER IMAGE */}
        <View style={styles.playerCard}>
          <ImageBackground
            source={{ uri: player.strThumb || player.strCutout }}
            style={styles.playerImage}
            imageStyle={{ borderRadius: 20 }}
            resizeMode="cover"
          >
            <View style={styles.favoriteButton}>
              <Feather name="heart" size={24} color="#fff" />
            </View>
          </ImageBackground>

          <Text style={styles.playerName}>{player.strPlayer}</Text>
          <Text style={styles.team}>
            {player.strTeam || "No Team"} | {player.strNumber || "#?"}
          </Text>

          <View style={styles.positionBadge}>
            <Text style={styles.positionText}>{player.strPosition || "Unknown Position"}</Text>
          </View>
        </View>

        {/* ABOUT */}
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutCard}>
          {player.strDescriptionEN ? (
            <Text style={styles.aboutText}>{player.strDescriptionEN}</Text>
          ) : (
            <Text style={styles.aboutText}>No biography available.</Text>
          )}
        </View>

        {/* QUICK STATS */}
        <Text style={styles.sectionTitle}>Basic Info</Text>
        <View style={styles.infoList}>
          <Text style={styles.infoText}>Nationality: {player.strNationality}</Text>
          <Text style={styles.infoText}>Sport: {player.strSport}</Text>
          <Text style={styles.infoText}>Height: {player.strHeight}</Text>
          <Text style={styles.infoText}>Weight: {player.strWeight}</Text>
          <Text style={styles.infoText}>Date of Birth: {player.dateBorn}</Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

/* ====== STYLES ====== */
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  playerCard: { alignItems: 'center', marginBottom: 20 },
  playerImage: { width: 220, height: 280, justifyContent: 'flex-end' },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 30,
  },
  playerName: { fontSize: 32, fontWeight: 'bold', color: '#000', marginTop: 16 },
  team: { fontSize: 18, color: '#666', marginTop: 4 },
  positionBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  positionText: { color: '#fff', fontWeight: 'bold' },

  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },

  aboutCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginHorizontal: 20,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },

  infoList: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginHorizontal: 20,
    gap: 8,
    elevation: 4,
  },
  infoText: {
    fontSize: 15,
    color: '#333',
  },
});
