import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

// APIs Used
const UPCOMING_API =
  "https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328"; // Premier League
const SPORTS_API =
  "https://www.thesportsdb.com/api/v1/json/3/all_sports.php";
const NEWS_API = `https://newsapi.org/v2/everything?q=sports&sortBy=publishedAt&pageSize=10&language=en&apiKey=9ea090ae767c48b98d081cfd16947da2`;

// MULTI-SPORT LIVE API (NBA, NFL, MLB, PGA, NHL, soccer, CFB — free tier)
const LIVE_API = "https://live-score-api.p.rapidapi.com/api/v1/live";

export default function Home() {
  const router = useRouter();
  const { colors } = useTheme();
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [sports, setSports] = useState([]);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingSports, setLoadingSports] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingLive, setLoadingLive] = useState(true);

  // Fetch multi-sport live matches (NBA, NFL, soccer, etc.)
  const fetchLiveMatches = async () => {
    try {
      const res = await fetch(LIVE_API, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': '9ea090ae767c48b98d081cfd16947da2', // Your key
          'X-RapidAPI-Host': 'live-score-api.p.rapidapi.com',
        },
      });
      const data = await res.json();
      const matches = data.data || [];

      const live = matches
        .filter((m: any) => m.status === 'LIVE' || m.status === 'IN_PLAY')
        .slice(0, 3)
        .map((m: any) => ({
          strHomeTeam: m.home.team_name,
          strAwayTeam: m.away.team_name,
          intHomeScore: m.home.score,
          intAwayScore: m.away.score,
          strProgress: m.time || m.status,
          strLeague: m.league.name,
        }));

      setLiveMatches(live);
    } catch (err) {
      console.log("Live matches error:", err);
      setLiveMatches([]); // Empty if error
    } finally {
      setLoadingLive(false);
    }
  };

  // Fetch upcoming matches
  const fetchUpcoming = async () => {
    try {
      const res = await fetch(UPCOMING_API);
      const data = await res.json();
      setUpcomingMatches(data.events || []);
    } catch (err) {
      console.log("Error fetching matches:", err);
    } finally {
      setLoadingMatches(false);
    }
  };

  // Fetch sports list
  const fetchSports = async () => {
    try {
      const res = await fetch(SPORTS_API);
      const data = await res.json();
      setSports(data.sports || []);
    } catch (err) {
      console.log("Error fetching sports:", err);
    } finally {
      setLoadingSports(false);
    }
  };

  // Fetch 3 latest real sports news
  const fetchLatestNews = async () => {
    try {
      const res = await fetch(NEWS_API);
      const data = await res.json();
      if (data.articles) {
        const cleanNews = data.articles
          .filter((a: any) => a.title && a.urlToImage)
          .slice(0, 3)
          .map((article: any) => ({
            title: article.title.split(' - ')[0].split(' | ')[0].trim(),
            image: article.urlToImage,
            url: article.url,
          }));
        setLatestNews(cleanNews);
      }
    } catch (err) {
      console.log("Error fetching news:", err);
    } finally {
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    fetchLiveMatches();
    fetchUpcoming();
    fetchSports();
    fetchLatestNews();
  }, []);

  const openNewsDetail = (url: string, title: string) => {
    router.push({
      pathname: '/news-detail',
      params: { url, title },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView style={[styles.scrollView, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={[styles.header, { backgroundColor: colors.header }]}> 
          <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
          <TouchableOpacity onPress={() => router.push('/profile')} style={[styles.profileCircle, { backgroundColor: colors.primary, borderColor: colors.card }]}> 
            <Text style={[styles.profileInitial, { color: colors.card }]}>J</Text>
          </TouchableOpacity>
        </View>

        {/* Top Live Matches */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Top Live Matches</Text>
        {loadingLive ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.liveContainer}>
            {liveMatches.length === 0 ? (
              <ImageBackground
                source={require('../../assets/images/icon.png')}
                style={[styles.liveCard, { backgroundColor: colors.primary }]}
                imageStyle={{ borderRadius: 16, opacity: 0.7 }}
              >
                <View style={[styles.liveBadge, { backgroundColor: '#ff3b30' }]}> 
                  <Text style={[styles.liveText, { color: colors.card }]}>Quiet</Text>
                </View>
                <View style={styles.scoreContainer}>
                  <Text style={[styles.team, { color: colors.card }]}>No live matches</Text>
                  <Text style={[styles.score, { color: colors.card }]}>—</Text>
                  <Text style={[styles.team, { color: colors.card }]}>Check back soon!</Text>
                </View>
                <TouchableOpacity style={[styles.watchButton, { backgroundColor: colors.card }]}> 
                  <Text style={[styles.watchText, { color: colors.primary }]}>Upcoming</Text>
                </TouchableOpacity>
              </ImageBackground>
            ) : (
              liveMatches.map((match: any, i) => (
                <ImageBackground
                  key={i}
                  source={require('../../assets/images/icon.png')}
                  style={[styles.liveCard, { backgroundColor: colors.primary }]}
                  imageStyle={{ borderRadius: 16, opacity: 0.7 }}
                >
                  <View style={[styles.liveBadge, { backgroundColor: '#ff3b30' }]}> 
                    <Text style={[styles.liveText, { color: colors.card }]}>LIVE</Text>
                  </View>
                  <View style={styles.scoreContainer}>
                    <Text style={[styles.team, { color: colors.card }]}>{match.strHomeTeam}</Text>
                    <Text style={[styles.score, { color: colors.card }]}>
                      {match.intHomeScore} - {match.intAwayScore}
                    </Text>
                    <Text style={[styles.team, { color: colors.card }]}>{match.strAwayTeam}</Text>
                  </View>
                  <TouchableOpacity style={[styles.watchButton, { backgroundColor: colors.card }]}> 
                    <Text style={[styles.watchText, { color: colors.primary }]}>Watch Live</Text>
                  </TouchableOpacity>
                </ImageBackground>
              ))
            )}
            <View style={[styles.sideCard, { backgroundColor: colors.card }]} />
          </View>
        )}

        {/* UPCOMING MATCHES */}
        <View style={styles.newsHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Matches</Text>
          <TouchableOpacity onPress={() => router.push('/upcoming-matches')}>
            <Feather name="arrow-right" size={26} color={colors.primary} />
          </TouchableOpacity>
        </View>
        {loadingMatches ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.upcomingContainer}>
            {upcomingMatches.slice(0, 5).map((match: any, i) => (
              <View key={i} style={[styles.upcomingCard, { backgroundColor: colors.card, shadowColor: colors.border }]}> 
                <View style={styles.matchHeader}>
                  <Text style={[styles.leagueTag, { backgroundColor: colors.primary, color: colors.card }]}> {match.strLeague} </Text>
                  <Text style={[styles.time, { color: colors.textSecondary }]}>
                    {match.dateEvent} {match.strTime?.slice(0, 5)}
                  </Text>
                </View>
                <View style={styles.teamsContainer}>
                  <Text style={[styles.teamName, { color: colors.text }]}>{match.strHomeTeam}</Text>
                  <Text style={[styles.vs, { color: colors.textSecondary }]}>VS</Text>
                  <Text style={[styles.teamName, { color: colors.text }]}>{match.strAwayTeam}</Text>
                </View>
                <View style={styles.venueContainer}>
                  <Feather name="map-pin" size={14} color={colors.textSecondary} />
                  <Text style={[styles.venue, { color: colors.textSecondary }]}>{match.strVenue}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* LATEST NEWS */}
        <View style={styles.newsHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Latest News</Text>
          <TouchableOpacity onPress={() => router.push('/news-screen')}>
            <Feather name="arrow-right" size={26} color={colors.primary} />
          </TouchableOpacity>
        </View>
        {loadingNews ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
        ) : (
          <View style={{ paddingHorizontal: 20, gap: 12 }}>
            {latestNews.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.newsCard, { backgroundColor: colors.card, shadowColor: colors.border }]}
                onPress={() => openNewsDetail(item.url, item.title)}
                activeOpacity={0.9}
              >
                <Image source={{ uri: item.image }} style={styles.newsImage} />
                <View style={styles.newsContent}>
                  <Text style={[styles.sportTag, { color: colors.primary }]}>Sports</Text>
                  <Text style={[styles.newsTitle, { color: colors.text }]} numberOfLines={2}>
                    {item.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// YOUR ORIGINAL STYLES — 100% UNCHANGED
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  logo: { width: 50, height: 50, borderRadius: 25 },
  profileCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  profileInitial: { fontSize: 18, fontWeight: 'bold' },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  liveContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 15 },
  liveCard: {
    width: 240,
    height: 160,
    justifyContent: 'space-between',
    padding: 15,
  },
  liveBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  liveText: { fontWeight: 'bold', fontSize: 12 },
  scoreContainer: { alignItems: 'center' },
  team: { fontSize: 16, fontWeight: 'bold' },
  score: { fontSize: 32, fontWeight: 'bold' },
  watchButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf: 'center',
  },
  watchText: { fontWeight: 'bold' },
  sideCard: { width: 100, height: 160, borderRadius: 16 },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  upcomingContainer: { paddingHorizontal: 20, gap: 12 },
  upcomingCard: {
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leagueTag: {
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  time: {
    fontSize: 13,
    fontWeight: '600',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  vs: {
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  venueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  venue: { fontSize: 13 },
  newsCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  newsImage: { width: 100, height: 100 },
  newsContent: { flex: 1, padding: 15, justifyContent: 'center' },
  sportTag: { fontWeight: 'bold', fontSize: 12 },
  newsTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 5, color: '#000' },
});