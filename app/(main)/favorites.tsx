// app/(main)/favorites.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router'; // ← ADD Href HERE

export default function Favorites() {
  const router = useRouter();

  const favoriteTeams = [
    { id: 'manutd', name: 'Manchester United', league: 'Premier League', logo: require('../../assets/images/icon.png') },
    { id: 'lakers', name: 'Los Angeles Lakers', league: 'NBA Western Conference', logo: require('../../assets/images/icon.png') },
    { id: 'mumbai', name: 'Mumbai Indians', league: 'IPL Cricket', logo: require('../../assets/images/icon.png') },
  ];

  const favoritePlayers = [
    { id: 'ronaldo', name: 'Cristiano Ronaldo', role: 'Striker | Football', photo: require('../../assets/images/icon.png') },
    { id: 'lebron', name: 'LeBron James', role: 'Small Forward | Basketball', photo: require('../../assets/images/icon.png') },
    { id: 'messi', name: 'Lionel Messi', role: 'Forward | Football', photo: require('../../assets/images/icon.png') },
  ];

  const openPlayerProfile = (playerId: string) => {
    const path = `/player-profile/${playerId}` as any;
    router.push(path);
  };

  const openTeamProfile = (teamId: string) => {
    alert(`Team Profile: ${teamId} (Coming soon!)`);
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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
        <Text style={styles.searchText}>Search favourite teams, players, or matches</Text>
      </View>

      {/* Favourite Teams */}
      <Text style={styles.sectionTitle}>Favourite Teams</Text>
      <View style={styles.list}>
        {favoriteTeams.map((team) => (
          <View key={team.id} style={styles.teamCard}>
            <Image source={team.logo} style={styles.teamLogo} />
            <View style={styles.teamInfo}>
              <Text style={styles.teamName}>{team.name}</Text>
              <Text style={styles.league}>{team.league}</Text>
            </View>
            <TouchableOpacity 
              style={styles.detailsButton}
              onPress={() => openTeamProfile(team.id)}
            >
              <Text style={styles.detailsText}>Details</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Favourite Players */}
      <Text style={styles.sectionTitle}>Favourite Players</Text>
      <View style={styles.list}>
        {favoritePlayers.map((player) => (
          <View key={player.id} style={styles.playerCard}>
            <Image source={player.photo} style={styles.playerPhoto} />
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.role}>{player.role}</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => openPlayerProfile(player.id)} // ← NOW 100% NO ERROR
            >
              <Text style={styles.profileText}>Profile</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// ← STYLES SAME AS BEFORE (copy from previous message)
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: { marginRight: 10 },
  searchText: { fontSize: 16, color: '#888' },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
    color: '#000',
  },
  list: { paddingHorizontal: 20 },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  teamLogo: { width: 50, height: 50, borderRadius: 25, marginRight: 16 },
  teamInfo: { flex: 1 },
  teamName: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  league: { fontSize: 13, color: '#666', marginTop: 2 },
  detailsButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  detailsText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  playerPhoto: { width: 50, height: 50, borderRadius: 25, marginRight: 16 },
  playerInfo: { flex: 1 },
  playerName: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  role: { fontSize: 13, color: '#666', marginTop: 2 },
  profileButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  profileText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});