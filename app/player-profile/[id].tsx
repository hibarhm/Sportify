// app/player-profile/[id].tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const playersDB: Record<string, any> = {
  messi: {
    name: 'Lionel Messi',
    team: 'Inter Miami CF | #10',
    position: 'Forward',
    image: 'https://i.imgur.com/0mD6n3U.jpg', // remote
    goals: 850,
    assists: 370,
    matches: 1100,
    recentMatches: [
      { date: '2024-05-18', opponent: 'Orlando City', goals: 2, assists: 1, result: 'Win' },
      { date: '2024-05-11', opponent: 'Nashville SC', goals: 0, assists: 1, result: 'Draw' },
      { date: '2024-05-04', opponent: 'Atlanta United', goals: 1, assists: 0, result: 'Loss' },
      { date: '2024-04-27', opponent: 'New England', goals: 3, assists: 2, result: 'Win' },
    ],
    achievements: [
      { icon: 'award', title: 'Golden Boot', year: '2023' },
      { icon: 'shield', title: 'League MVP', year: '2022' },
      { icon: 'target', title: 'MLS Cup', year: '2023' },
    ],
  },
  ronaldo: {
    name: 'Cristiano Ronaldo',
    team: 'Al Nassr | #7',
    position: 'Forward',
    image: require('../../assets/images/ronaldo.jpg'), // LOCAL IMAGE
    goals: 895,
    assists: 250,
    matches: 1200,
    recentMatches: [
      { date: '2024-05-20', opponent: 'Al Hilal', goals: 3, assists: 1, result: 'Win' },
    ],
    achievements: [
      { icon: 'award', title: 'Top Scorer', year: '2024' },
    ],
  },
  lebron: {
    name: 'LeBron James',
    team: 'Los Angeles Lakers | #23',
    position: 'Small Forward',
    image: 'https://i.imgur.com/LeBron.jpg', // remote
    goals: 0,
    assists: 10200,
    matches: 1500,
    recentMatches: [
      { date: '2024-05-15', opponent: 'Denver Nuggets', goals: 0, assists: 12, result: 'Win' },
    ],
    achievements: [
      { icon: 'award', title: 'NBA Champion', year: '2020' },
      { icon: 'shield', title: '4× MVP', year: '2013' },
    ],
  },
};

export default function PlayerProfile() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const playerId = Array.isArray(id) ? id[0] : id;
  const player = playersDB[playerId] || playersDB.messi;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push('/(main)/favorites')}>
            <Feather name="arrow-left" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Player Profile</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* PLAYER CARD */}
        <View style={styles.playerCard}>
          <ImageBackground
            source={typeof player.image === 'string' ? { uri: player.image } : player.image}
            style={styles.playerImage}
            imageStyle={{ borderRadius: 20 }}
            resizeMode="cover"
          >
            <View style={styles.favoriteButton}>
              <Feather name="heart" size={24} color="#fff" />
            </View>
          </ImageBackground>

          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.team}>{player.team}</Text>
          <View style={styles.positionBadge}>
            <Text style={styles.positionText}>{player.position}</Text>
          </View>
        </View>

        {/* KEY STATS */}
        <Text style={styles.sectionTitle}>Key Statistics</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Goals</Text>
            <Text style={styles.statValue}>{player.goals}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Assists</Text>
            <Text style={styles.statValue}>{player.assists}</Text>
          </View>
        </View>
        <View style={styles.statCenter}>
          <Text style={styles.statLabel}>Matches</Text>
          <Text style={styles.statValue}>{player.matches}</Text>
        </View>

        {/* RECENT MATCHES */}
        <Text style={styles.sectionTitle}>Recent Matches</Text>
        {player.recentMatches.map((match: any, i: number) => (
          <View key={i} style={styles.matchCard}>
            <Text style={styles.matchDate}>{match.date}</Text>
            <Text style={styles.opponent}>{match.opponent}</Text>
            <View style={styles.matchStats}>
              <Text style={styles.statText}>Goals: {match.goals}</Text>
              <Text style={styles.statText}>Assists: {match.assists}</Text>
              <View
                style={[
                  styles.resultBadge,
                  match.result === 'Win' && styles.win,
                  match.result === 'Draw' && styles.draw,
                  match.result === 'Loss' && styles.loss,
                ]}
              >
                <Text style={styles.resultText}>{match.result}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* ACHIEVEMENTS */}
        <Text style={styles.sectionTitle}>Achievements</Text>
        {player.achievements.map((ach: any, i: number) => (
          <View key={i} style={styles.achievementCard}>
            <Feather name={ach.icon} size={24} color="#007AFF" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.achievementTitle}>{ach.title}</Text>
              <Text style={styles.achievementYear}>{ach.year}</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  playerImage: { width: 200, height: 280, justifyContent: 'flex-end' },
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
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 20 },
  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statCenter: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statLabel: { fontSize: 16, color: '#666' },
  statValue: { fontSize: 36, fontWeight: 'bold', color: '#000', marginTop: 8 },
  matchCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  matchDate: { fontSize: 14, color: '#666' },
  opponent: { fontSize: 18, fontWeight: 'bold', marginTop: 4 },
  matchStats: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 12 },
  statText: { fontSize: 14, color: '#666' },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginLeft: 'auto',
  },
  win: { backgroundColor: '#E3FCEC' },
  draw: { backgroundColor: '#FFF4E5' },
  loss: { backgroundColor: '#FFE5E5' },
  resultText: { fontSize: 12, fontWeight: 'bold', color: '#000' },
  achievementCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  achievementTitle: { fontSize: 16, fontWeight: 'bold' },
  achievementYear: { fontSize: 14, color: '#666', marginTop: 4 },
});