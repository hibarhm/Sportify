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

// APIs Used
const UPCOMING_API =
  "https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328"; // Premier League
const SPORTS_API =
  "https://www.thesportsdb.com/api/v1/json/3/all_sports.php";

// Real News API (your key already working)
const NEWS_API = `https://newsapi.org/v2/everything?q=sports&sortBy=publishedAt&pageSize=10&language=en&apiKey=9ea090ae767c48b98d081cfd16947da2`;

export default function Home() {
  const router = useRouter();
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [sports, setSports] = useState([]);
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [loadingSports, setLoadingSports] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);

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
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
          <TouchableOpacity onPress={() => router.push('/profile')} style={styles.profileCircle}>
            <Text style={styles.profileInitial}>J</Text>
          </TouchableOpacity>
        </View>

        {/* Top Live Matches */}
        <Text style={styles.sectionTitle}>Top Live Matches</Text>
        <View style={styles.liveContainer}>
          <ImageBackground
            source={require('../../assets/images/icon.png')}
            style={styles.liveCard}
            imageStyle={{ borderRadius: 16, opacity: 0.7 }}
          >
            <View style={styles.liveBadge}>
              <Text style={styles.liveText}>Live</Text>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={styles.team}>FC Rovers</Text>
              <Text style={styles.score}>2 - 1</Text>
              <Text style={styles.team}>City United</Text>
            </View>
            <TouchableOpacity style={styles.watchButton}>
              <Text style={styles.watchText}>Watch Live</Text>
            </TouchableOpacity>
          </ImageBackground>
          <View style={styles.sideCard} />
        </View>

        {/* UPCOMING MATCHES */}
        <View style={styles.newsHeader}>
          <Text style={styles.sectionTitle}>Upcoming Matches</Text>
          <TouchableOpacity onPress={() => router.push('/upcoming-matches')}>
            <Feather name="arrow-right" size={26} color="#007AFF" />
          </TouchableOpacity>
        </View>
        {loadingMatches ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.upcomingContainer}>
            {upcomingMatches.slice(0, 5).map((match: any, i) => (
              <View key={i} style={styles.upcomingCard}>
                <View style={styles.matchHeader}>
                  <Text style={styles.leagueTag}>{match.strLeague}</Text>
                  <Text style={styles.time}>
                    {match.dateEvent} {match.strTime?.slice(0, 5)}
                  </Text>
                </View>
                <View style={styles.teamsContainer}>
                  <Text style={styles.teamName}>{match.strHomeTeam}</Text>
                  <Text style={styles.vs}>VS</Text>
                  <Text style={styles.teamName}>{match.strAwayTeam}</Text>
                </View>
                <View style={styles.venueContainer}>
                  <Feather name="map-pin" size={14} color="#666" />
                  <Text style={styles.venue}>{match.strVenue}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* LATEST NEWS - NOW 100% REAL */}
        <View style={styles.newsHeader}>
          <Text style={styles.sectionTitle}>Latest News</Text>
          <TouchableOpacity onPress={() => router.push('/news-screen')}>
            <Feather name="arrow-right" size={26} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {loadingNews ? (
          <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
        ) : (
          <View style={{ paddingHorizontal: 20, gap: 12 }}>
            {latestNews.map((item, i) => (
              <TouchableOpacity
                key={i}
                style={styles.newsCard}
                onPress={() => openNewsDetail(item.url, item.title)}
                activeOpacity={0.9}
              >
                <Image source={{ uri: item.image }} style={styles.newsImage} />
                <View style={styles.newsContent}>
                  <Text style={styles.sportTag}>Sports</Text>
                  <Text style={styles.newsTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* SPORTS CATEGORIES */}
        <Text style={styles.sectionTitle}>Sports Categories</Text>
        {loadingSports ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <View style={styles.categories}>
            {sports.slice(0, 3).map((sport: any, index) => (
              <TouchableOpacity key={index} style={styles.category}>
                <Feather name="grid" size={32} color="#007AFF" />
                <Text style={styles.categoryText}>{sport.strSport}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// YOUR ORIGINAL STYLES - 100% UNCHANGED
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  scrollView: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: { width: 50, height: 50, borderRadius: 25 },
  profileCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInitial: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
    color: '#000',
  },
  liveContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 15 },
  liveCard: {
    width: 240,
    height: 160,
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#007AFF',
  },
  liveBadge: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  liveText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  scoreContainer: { alignItems: 'center' },
  team: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  score: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  watchButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf: 'center',
  },
  watchText: { color: '#007AFF', fontWeight: 'bold' },
  sideCard: { width: 100, height: 160, backgroundColor: '#ddd', borderRadius: 16 },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  // Upcoming
  upcomingContainer: { paddingHorizontal: 20, gap: 12 },
  upcomingCard: {
    backgroundColor: '#fff',
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
    backgroundColor: '#007AFF',
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  time: {
    fontSize: 13,
    color: '#666',
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
    color: '#666',
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  venueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  venue: { fontSize: 13, color: '#666' },
  // News
  newsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
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
  sportTag: { color: '#007AFF', fontWeight: 'bold', fontSize: 12 },
  newsTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 5, color: '#000' },
  // Categories
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    marginTop: 10,
  },
  category: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryText: { marginTop: 8, fontWeight: '600', color: '#000' },
});