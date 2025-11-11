// app/(main)/index.tsx
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function Home() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
          <Text style={styles.headerTitle}>Home</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Top Live Matches */}
        <Text style={styles.sectionTitle}>Top Live Matches</Text>
        <View style={styles.liveContainer}>
          <ImageBackground
            source={require('../../assets/images/icon.png')}
            style={styles.liveCard}
            imageStyle={{ borderRadius: 16, opacity: 0.7 }}
          >
            <View style={styles.liveBadge}><Text style={styles.liveText}>Live</Text></View>
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

        {/* Latest News */}
        <Text style={styles.sectionTitle}>Latest News</Text>
        <View style={styles.newsCard}>
          <Image source={require('../../assets/images/icon.png')} style={styles.newsImage} />
          <View style={styles.newsContent}>
            <Text style={styles.sportTag}>Football</Text>
            <Text style={styles.newsTitle}>Top Scorers in Premier League: Race Heats Up</Text>
          </View>
        </View>

        {/* Sports Categories */}
        <Text style={styles.sectionTitle}>Sports Categories</Text>
        <View style={styles.categories}>
          <TouchableOpacity style={styles.category}>
            <Feather name="youtube" size={32} color="#007AFF" />
            <Text style={styles.categoryText}>Football</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.category}>
            <Feather name="grid" size={32} color="#007AFF" />
            <Text style={styles.categoryText}>Cricket</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.category}>
            <Feather name="shuffle" size={32} color="#007AFF" />
            <Text style={styles.categoryText}>Basketball</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#fff' },
  logo: { width: 40, height: 40, borderRadius: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginLeft: 20, marginTop: 20, marginBottom: 10 },
  liveContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 15 },
  liveCard: { width: 240, height: 160, justifyContent: 'space-between', padding: 15, backgroundColor: '#007AFF' },
  liveBadge: { backgroundColor: '#ff3b30', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, alignSelf: 'flex-start' },
  liveText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  scoreContainer: { alignItems: 'center' },
  team: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  score: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  watchButton: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, alignSelf: 'center' },
  watchText: { color: '#007AFF', fontWeight: 'bold' },
  sideCard: { width: 100, height: 160, backgroundColor: '#ddd', borderRadius: 16 },
  newsCard: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 15, borderRadius: 16, overflow: 'hidden' },
  newsImage: { width: 100, height: 100 },
  newsContent: { flex: 1, padding: 15, justifyContent: 'center' },
  sportTag: { color: '#007AFF', fontWeight: 'bold', fontSize: 12 },
  newsTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 5 },
  categories: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 40, marginTop: 10 },
  category: { alignItems: 'center' },
  categoryText: { marginTop: 8, fontWeight: '600' },
});
