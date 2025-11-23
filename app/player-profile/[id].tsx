// app/player-profile/[id].tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PlayerProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const playerId = Array.isArray(id) ? id[0] : id;

  const [player, setPlayer] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  /** ============================
   * FETCH PLAYER DETAILS
   * ============================ */
  const fetchPlayer = async () => {
    try {
      const res = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${playerId}`
      );
      const data = await res.json();
      setPlayer(data?.players?.[0] || null);
    } catch (error) {
      console.log("❌ Player fetch error:", error);
    }
  };

  /** ============================
   * FETCH PLAYER ACHIEVEMENTS
   * ============================ */
  const fetchAchievements = async (playerName: string) => {
    try {
      const res = await fetch(
        `https://www.thesportsdb.com/api/v1/json/3/searchhonors.php?p=${encodeURIComponent(playerName)}`
      );
      const data = await res.json();
      setAchievements(data?.honors || []);
    } catch (error) {
      console.log("❌ Achievement error:", error);
    }
  };

  /** ============================
   * CHECK IF PLAYER IS FAVORITE
   * ============================ */
  const checkIsFavorite = async () => {
    const stored = await AsyncStorage.getItem("favorites");
    const list = stored ? JSON.parse(stored) : [];
    const exists = list.some((p: any) => p.idPlayer === playerId);
    setIsFavorite(exists);
  };

  /** ============================
   * ADD TO FAVORITES
   * ============================ */
  const addToFavorites = async () => {
    const stored = await AsyncStorage.getItem("favorites");
    const list = stored ? JSON.parse(stored) : [];

    if (!list.some((p: any) => p.idPlayer === player.idPlayer)) {
      list.push({
        idPlayer: player.idPlayer,
        name: player.strPlayer,
        thumb: player.strThumb,
        team: player.strTeam,
        position: player.strPosition,
      });

      await AsyncStorage.setItem("favorites", JSON.stringify(list));
      setIsFavorite(true);
    }
  };

  /** ============================
   * REMOVE FROM FAVORITES
   * ============================ */
  const removeFromFavorites = async () => {
    const stored = await AsyncStorage.getItem("favorites");
    const list = stored ? JSON.parse(stored) : [];

    const updated = list.filter((p: any) => p.idPlayer !== player.idPlayer);

    await AsyncStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(false);
  };

  /** ============================
   * INITIAL FETCH
   * ============================ */
  useEffect(() => {
    const loadData = async () => {
      await fetchPlayer();
    };
    loadData();
  }, [playerId]);

  /** ============================
   * FETCH ACHIEVEMENTS & CHECK FAVORITES
   * ============================ */
  useEffect(() => {
    if (player) {
      fetchAchievements(player.strPlayer);
      checkIsFavorite();
      setLoading(false);
    }
  }, [player]);

  /** ============================
   * RENDERING
   * ============================ */
  if (loading || !player) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* HEADER */}
        <View style={styles.header}>
         <TouchableOpacity onPress={() => router.push("/favorites")}>
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
          />

          {/* ADD / REMOVE FAVORITE BUTTON */}
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={isFavorite ? removeFromFavorites : addToFavorites}
          >
            <Feather
              name={isFavorite ? "x" : "heart"}
              size={22}
              color="#fff"
            />
            <Text style={styles.favoriteText}>
              {isFavorite ? "Remove Favorite" : "Add to Favorites"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.playerName}>{player.strPlayer}</Text>
          <Text style={styles.team}>
            {player.strTeam || "No Team"} | #{player.strNumber || "?"}
          </Text>

          <View style={styles.positionBadge}>
            <Text style={styles.positionText}>
              {player.strPosition || "Unknown Position"}
            </Text>
          </View>
        </View>

        {/* ABOUT SECTION */}
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.aboutText}>
            {player.strDescriptionEN || "No biography available."}
          </Text>
        </View>

        {/* BASIC INFO */}
        <Text style={styles.sectionTitle}>Basic Info</Text>
        <View style={styles.infoList}>
          <Text style={styles.infoText}>Nationality: {player.strNationality}</Text>
          <Text style={styles.infoText}>Sport: {player.strSport}</Text>
          <Text style={styles.infoText}>Height: {player.strHeight}</Text>
          <Text style={styles.infoText}>Weight: {player.strWeight}</Text>
          <Text style={styles.infoText}>Born: {player.dateBorn}</Text>
        </View>

        {/* ACHIEVEMENTS */}
        <Text style={styles.sectionTitle}>Achievements</Text>

        {achievements.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#666", marginBottom: 20 }}>
            No achievements found.
          </Text>
        ) : (
          achievements.map((ach, index) => (
            <View key={index} style={styles.achievementCard}>
              <Feather name="award" size={24} color="#007AFF" />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.achievementTitle}>{ach.strHonour}</Text>
                <Text style={styles.achievementYear}>{ach.strSeason}</Text>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

/* ================================
   STYLES
================================ */
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, backgroundColor: "#f8f9fa" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },

  title: { fontSize: 24, fontWeight: "bold", color: "#000" },

  playerCard: { alignItems: "center", marginBottom: 20 },

  playerImage: {
    width: 240,
    height: 300,
    borderRadius: 20,
    marginBottom: 16,
  },

  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 12,
    gap: 8,
  },

  favoriteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  playerName: { fontSize: 32, fontWeight: "bold", color: "#000" },

  team: { fontSize: 18, color: "#666", marginTop: 4 },

  positionBadge: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },

  positionText: { color: "#fff", fontWeight: "bold" },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 10,
    color: "#000",
  },

  aboutCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 20,
    elevation: 3,
  },

  aboutText: { fontSize: 14, lineHeight: 20, color: "#444" },

  infoList: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 20,
    gap: 6,
    elevation: 3,
  },

  infoText: { fontSize: 15, color: "#333" },

  achievementCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },

  achievementTitle: { fontSize: 16, fontWeight: "bold" },
  achievementYear: { fontSize: 14, color: "#666" },
});
