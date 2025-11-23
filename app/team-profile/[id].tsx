// app/team-profile/[id].tsx
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "favorites";

export default function TeamProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const teamId = Array.isArray(id) ? id[0] : id;

  const [team, setTeam] = useState<any>(null);
  const [players, setPlayers] = useState<any[]>([]);
  const [recentMatches, setRecentMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // fetch team
  const fetchTeam = async () => {
    try {
      const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/lookupteam.php?id=${teamId}`);
      const data = await res.json();
      setTeam(data?.teams?.[0] || null);
    } catch (err) {
      console.log("fetchTeam err", err);
    }
  };

  // fetch team players
  const fetchPlayers = async () => {
    try {
      const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/lookup_all_players.php?id=${teamId}`);
      const data = await res.json();
      setPlayers(data?.player || []);
    } catch (err) {
      console.log("fetchPlayers err", err);
    }
  };

  // fetch recent matches (last results)
  const fetchRecentMatches = async () => {
    try {
      const res = await fetch(`https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${teamId}`);
      const data = await res.json();
      setRecentMatches(data?.results || data?.events || []);
    } catch (err) {
      console.log("fetchRecentMatches err", err);
    }
  };

  // check favorite
  const checkIsFavorite = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const list = stored ? JSON.parse(stored) : [];
      setIsFavorite(list.some((it: any) => it.type === "team" && it.id === teamId));
    } catch (err) {
      console.log("checkIsFavorite err", err);
    }
  };

  const addToFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const list = stored ? JSON.parse(stored) : [];
      if (!list.some((it: any) => it.type === "team" && it.id === team.idTeam)) {
        list.push({
          type: "team",
          id: team.idTeam,
          name: team.strTeam,
          thumb: team.strTeamBadge || team.strTeamLogo || team.strStadiumThumb || null,
          meta: { league: team.strLeague, country: team.strCountry },
        });
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        setIsFavorite(true);
        Alert.alert("Added", `${team.strTeam} added to favorites.`);
      } else {
        Alert.alert("Already", "Team already in favorites.");
      }
    } catch (err) {
      console.log("add team fav err", err);
    }
  };

  const removeFromFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const list = stored ? JSON.parse(stored) : [];
      const updated = list.filter((it: any) => !(it.type === "team" && it.id === team.idTeam));
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setIsFavorite(false);
      Alert.alert("Removed", `${team.strTeam} removed from favorites.`);
    } catch (err) {
      console.log("remove team fav err", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await Promise.all([fetchTeam(), fetchPlayers(), fetchRecentMatches()]);
      await checkIsFavorite();
      setLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!team) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18 }}>Team not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/favorites")}>
          <Feather name="arrow-left" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{team.strTeam}</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Banner */}
      <View style={styles.banner}>
        {team.strTeamBadge ? (
          <Image source={{ uri: team.strTeamBadge }} style={styles.badge} />
        ) : null}
        <Text style={styles.teamName}>{team.strTeam}</Text>
        <Text style={styles.league}>{team.strLeague}</Text>

        <TouchableOpacity
          style={[styles.favoriteButton, isFavorite ? { backgroundColor: "#FF3B30" } : undefined]}
          onPress={isFavorite ? removeFromFavorites : addToFavorites}
        >
          <Feather name={isFavorite ? "x" : "heart"} size={18} color="#fff" />
          <Text style={styles.favoriteText}>{isFavorite ? "Remove Favorite" : "Add to Favorites"}</Text>
        </TouchableOpacity>
      </View>

      {/* About */}
      <Text style={styles.sectionTitle}>About</Text>
      <View style={styles.card}>
        <Text style={{ color: "#333" }}>{team.strDescriptionEN || "No team description available."}</Text>
      </View>

      {/* Stadium + Country */}
      <Text style={styles.sectionTitle}>Details</Text>
      <View style={styles.rowCard}>
        <View style={styles.detailCol}>
          <Text style={styles.detailLabel}>Stadium</Text>
          <Text style={styles.detailText}>{team.strStadium || "N/A"}</Text>
        </View>
        <View style={styles.detailCol}>
          <Text style={styles.detailLabel}>Country</Text>
          <Text style={styles.detailText}>{team.strCountry || "N/A"}</Text>
        </View>
      </View>

      {/* Players */}
      <Text style={styles.sectionTitle}>Players</Text>
      <View style={styles.list}>
        {players.length === 0 ? (
          <Text style={styles.noResult}>No players found.</Text>
        ) : (
          players.slice(0, 10).map((p) => (
            <TouchableOpacity key={p.idPlayer} style={styles.item} onPress={() => router.push(`/player-profile/${p.idPlayer}`)}>
              <Image source={{ uri: p.strThumb || p.strCutout || undefined }} style={styles.playerThumb} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitle}>{p.strPlayer}</Text>
                <Text style={styles.itemSub}>{p.strPosition}</Text>
              </View>
              <Feather name="arrow-right" size={18} color="#007AFF" />
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Recent Matches */}
      <Text style={styles.sectionTitle}>Recent Matches</Text>
      <View style={styles.list}>
        {recentMatches.length === 0 ? (
          <Text style={styles.noResult}>No recent matches available.</Text>
        ) : (
          recentMatches.map((m: any, i: number) => (
            <View key={i} style={styles.matchCard}>
              <Text style={styles.matchTitle}>{m.strEvent || `${m.strHomeTeam} vs ${m.strAwayTeam}`}</Text>
              <Text style={styles.matchSub}>{m.dateEvent || m.date || ""} • {m.strVenue || ""}</Text>
              <Text style={styles.matchScore}>{m.intHomeScore != null ? `${m.intHomeScore} - ${m.intAwayScore}` : ""}</Text>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, backgroundColor: "#f8f9fa" },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20 },

  title: { fontSize: 20, fontWeight: "bold" },

  banner: { alignItems: "center", padding: 16, backgroundColor: "#fff", marginHorizontal: 16, borderRadius: 12, marginBottom: 12 },
  badge: { width: 88, height: 88, marginBottom: 8, resizeMode: "contain" },
  teamName: { fontSize: 22, fontWeight: "700" },
  league: { color: "#666", marginTop: 6 },

  favoriteButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#007AFF", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginTop: 10, gap: 8 },
  favoriteText: { color: "#fff", fontWeight: "700" },

  sectionTitle: { fontSize: 18, fontWeight: "700", marginLeft: 20, marginTop: 16, marginBottom: 8 },

  card: { backgroundColor: "#fff", marginHorizontal: 20, padding: 12, borderRadius: 12 },

  rowCard: { flexDirection: "row", justifyContent: "space-between", marginHorizontal: 20, marginBottom: 8 },
  detailCol: { width: "48%" },
  detailLabel: { fontSize: 13, color: "#666" },
  detailText: { fontSize: 15, fontWeight: "600", marginTop: 4 },

  list: { paddingHorizontal: 20 },

  item: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 10 },
  playerThumb: { width: 52, height: 52, borderRadius: 8, marginRight: 12, backgroundColor: "#eee" },
  itemTitle: { fontSize: 15, fontWeight: "700" },
  itemSub: { color: "#666", marginTop: 4 },

  matchCard: { backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 10 },
  matchTitle: { fontSize: 15, fontWeight: "700" },
  matchSub: { color: "#666", marginTop: 4 },
  matchScore: { marginTop: 6, fontWeight: "700" },

  noResult: { textAlign: "center", color: "#666", marginVertical: 12 },
});
