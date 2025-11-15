// app/(main)/upcoming-matches.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const upcomingMatches = [
  {
    league: 'Premier League',
    time: 'Tomorrow 20:00',
    home: 'Arsenal',
    away: 'Chelsea',
    venue: 'Emirates Stadium',
  },
  {
    league: 'La Liga',
    time: 'Sat 22:30',
    home: 'Real Madrid',
    away: 'Barcelona',
    venue: 'Santiago Bernabéu',
  },
  {
    league: 'NBA',
    time: 'Sun 03:00',
    home: 'Lakers',
    away: 'Warriors',
    venue: 'Crypto.com Arena',
  },
  {
    league: 'IPL',
    time: 'Sun 19:30',
    home: 'CSK',
    away: 'MI',
    venue: 'Chepauk',
  },
  {
    league: 'Serie A',
    time: 'Mon 19:45',
    home: 'Juventus',
    away: 'AC Milan',
    venue: 'Allianz Stadium',
  },
];

export default function UpcomingMatches() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Upcoming Matches</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* MATCH LIST */}
        <View style={styles.list}>
          {upcomingMatches.map((match, i) => (
            <View key={i} style={styles.card}>
              <View style={styles.headerRow}>
                <Text style={styles.league}>{match.league}</Text>
                <Text style={styles.time}>{match.time}</Text>
              </View>
              <View style={styles.teamsRow}>
                <Text style={styles.team}>{match.home}</Text>
                <Text style={styles.vs}>VS</Text>
                <Text style={styles.team}>{match.away}</Text>
              </View>
              <View style={styles.venueRow}>
                <Feather name="map-pin" size={14} color="#666" />
                <Text style={styles.venue}>{match.venue}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
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
    backgroundColor: '#fff',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  list: { paddingHorizontal: 20, paddingTop: 10 },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  league: {
    backgroundColor: '#007AFF',
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  time: { fontSize: 13, color: '#666', fontWeight: '600' },
  teamsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  team: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  vs: {
    fontSize: 15,
    color: '#666',
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  venue: { fontSize: 13, color: '#666' },
});