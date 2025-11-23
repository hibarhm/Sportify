// app/(main)/upcoming-matches.tsx  ← FULLY REAL MATCHES FROM API
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from './context/ThemeContext';

export default function UpcomingMatches() {
  const router = useRouter();
  const { colors } = useTheme();
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Multiple leagues for global coverage
  const leagues = [
    { id: 4328, name: 'Premier League' },
    { id: 4331, name: 'La Liga' },
    { id: 4332, name: 'Bundesliga' },
    { id: 4334, name: 'Ligue 1' },
    { id: 4335, name: 'Serie A' },
    { id: 4337, name: 'Primeira Liga' },
  ];

  const fetchAllMatches = async () => {
    try {
      const allMatches: any[] = [];

      for (const league of leagues) {
        const res = await fetch(
          `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${league.id}`
        );
        const data = await res.json();
        if (data.events) {
          data.events.forEach((match: any) => {
            allMatches.push({
              ...match,
              leagueName: league.name,
            });
          });
        }
      }

      // Sort by date
      allMatches.sort((a: any, b: any) => {
        const dateA = new Date(a.dateEvent + ' ' + a.strTime).getTime();
        const dateB = new Date(b.dateEvent + ' ' + b.strTime).getTime();
        return dateA - dateB;
      });

      setMatches(allMatches);
    } catch (err) {
      console.log('Error fetching matches:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllMatches();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllMatches();
  };

  const formatDate = (date: string, time: string) => {
    const matchDate = new Date(date + ' ' + (time || ''));
    const now = new Date();
    const diff = matchDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days < 7) return matchDate.toLocaleDateString('en', { weekday: 'short' });
    return matchDate.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}> 
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading global matches...</Text>
      </View>
    );
  }
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* HEADER */}
        <View style={[styles.header, { backgroundColor: colors.header }]}> 
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={28} color={colors.icon} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Upcoming Matches</Text>
          <View style={{ width: 28 }} />
        </View>
        {/* MATCH COUNT */}
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}> 
          {matches.length} matches coming up worldwide
        </Text>
        {/* MATCH LIST */}
        <View style={styles.list}>
          {matches.map((match: any, i) => (
            <View key={i} style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.border }]}> 
              <View style={styles.headerRow}>
                <Text style={[styles.league, { backgroundColor: colors.primary, color: colors.card }]}>{match.leagueName || match.strLeague}</Text>
                <Text style={[styles.time, { color: colors.textSecondary }]}> 
                  {formatDate(match.dateEvent, match.strTime)} • {match.strTime?.slice(0, 5) || 'TBD'}
                </Text>
              </View>
              <View style={styles.teamsRow}>
                <Text style={[styles.team, { color: colors.text }]} numberOfLines={1}>{match.strHomeTeam}</Text>
                <Text style={[styles.vs, { color: colors.textSecondary }]}>VS</Text>
                <Text style={[styles.team, { color: colors.text }]} numberOfLines={1}>{match.strAwayTeam}</Text>
              </View>
              <View style={styles.venueRow}>
                <Feather name="map-pin" size={14} color={colors.textSecondary} />
                <Text style={[styles.venue, { color: colors.textSecondary }]} numberOfLines={1}>
                  {match.strVenue || 'Venue TBD'}
                </Text>
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
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { paddingHorizontal: 20, fontSize: 14, marginBottom: 10 },
  list: { paddingHorizontal: 20, paddingTop: 10 },
  card: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
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
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  time: { fontSize: 13, fontWeight: '600' },
  teamsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  team: {
    fontSize: 17,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  vs: {
    fontSize: 15,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  venue: { fontSize: 13 },
});