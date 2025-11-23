// app/news-screen.tsx  ← FINAL: News opens INSIDE the app (no browser!)
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from './context/ThemeContext';

export default function NewsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [news, setNews] = useState<any[]>([]);
  const [filteredNews, setFilteredNews] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const tags = ['All', 'Football', 'Basketball', 'Tennis', 'Cricket', 'Volleyball', 'F1'];

  const fetchNews = async (category = '') => {
    try {
      const baseQuery = category && category !== 'All' ? category : 'sports';
      const excludeTerms = ' -education -politics -crime -india -bollywood -student -university -exam -election -movie -film -tech -optics -copackaged -sarawak -cabinet -bill -government -minister';
      const sportsSources = 'ESPN OR "BBC Sport" OR SkySports OR "The Guardian Sport"';

      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        `${baseQuery} ${sportsSources}${excludeTerms}`
      )}&sortBy=publishedAt&pageSize=40&language=en&apiKey=9ea090ae767c48b98d081cfd16947da2`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.articles && data.articles.length > 0) {
        const cleanArticles = data.articles
          .filter((a: any) => 
            a.title && 
            a.urlToImage && 
            a.url &&
            (a.source.name.toLowerCase().includes('sport') || 
             a.title.toLowerCase().match(/(match|game|league|player|team|goal|win|defeat|champion|tournament)/))
          )
          .slice(0, 25);

        const formatted = cleanArticles.map((article: any) => ({
          title: article.title.split(' - ')[0].split(' | ')[0].trim(),
          author: article.author || article.source.name || 'Sports Desk',
          publishedAt: new Date(article.publishedAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
          }),
          likes: Math.floor(Math.random() * 500) + 100,
          image: article.urlToImage,
          url: article.url,           // Full article link
        }));

        setNews(formatted);
        setFilteredNews(formatted);
      }
    } catch (err) {
      console.log('News fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    if (selectedTag === 'All') {
      setFilteredNews(news);
    } else {
      setFilteredNews(
        news.filter(item =>
          item.title.toLowerCase().includes(selectedTag.toLowerCase())
        )
      );
    }
  }, [selectedTag, news]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNews(selectedTag === 'All' ? '' : selectedTag);
  };

  // Opens article INSIDE the app using news-detail.tsx
  const openArticleInApp = (url: string, title: string) => {
    router.push({
      pathname: '/news-detail',
      params: { url, title }
    });
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}> 
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading sports news...</Text>
      </View>
    );
  }
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* YOUR ORIGINAL HEADER - 100% UNCHANGED */}
      <View style={[styles.header, { backgroundColor: colors.header }]}> 
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={28} color={colors.icon} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>News</Text>
        <TouchableOpacity>
          <Feather name="search" size={28} color={colors.icon} />
        </TouchableOpacity>
      </View>
      {/* Tags */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsContainer}>
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.tag, { backgroundColor: colors.input }, selectedTag === tag && { backgroundColor: colors.primary }]}
            onPress={() => {
              setSelectedTag(tag);
              setLoading(true);
              fetchNews(tag === 'All' ? '' : tag);
            }}
          >
            <Text style={[styles.tagText, { color: colors.textSecondary }, selectedTag === tag && { color: colors.card, fontWeight: 'bold' }]}> 
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* NEWS LIST - NOW OPENS INSIDE APP */}
      <View style={styles.newsList}>
        {filteredNews.length === 0 ? (
          <Text style={[styles.noNews, { color: colors.textSecondary }]}>No sports news found. Pull to refresh!</Text>
        ) : (
          filteredNews.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.newsCard, { backgroundColor: colors.card, shadowColor: colors.border }]}
              onPress={() => openArticleInApp(item.url, item.title)}
              activeOpacity={0.85}
            >
              <Image source={{ uri: item.image }} style={styles.newsImage} />
              <View style={styles.newsContent}>
                <Text style={[styles.newsTitle, { color: colors.text }]} numberOfLines={3}>
                  {item.title}
                </Text>
                <View style={styles.newsFooter}>
                  <Text style={[styles.author, { color: colors.textSecondary }]}>{item.author}</Text>
                  <View style={styles.likes}>
                    <Feather name="heart" size={16} color="#FF3B30" />
                    <Text style={[styles.likesCount, { color: colors.textSecondary }]}>{item.likes}</Text>
                  </View>
                  <View style={[styles.tagBadge, { backgroundColor: colors.input }]}> 
                    <Text style={[styles.tagBadgeText, { color: colors.textSecondary }]}>{selectedTag}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// YOUR ORIGINAL STYLES - 100% SAME
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#666' },
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
  tagsContainer: { paddingHorizontal: 20, marginBottom: 20 },
  tag: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  activeTag: { backgroundColor: '#007AFF' },
  tagText: { fontSize: 14, color: '#666' },
  activeTagText: { color: '#fff', fontWeight: 'bold' },
  newsList: { paddingHorizontal: 20 },
  noNews: { textAlign: 'center', marginTop: 60, color: '#666', fontSize: 16 },
  newsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  newsImage: { width: '100%', height: 200 },
  newsContent: { padding: 16 },
  newsTitle: { fontSize: 18, fontWeight: 'bold', color: '#000', lineHeight: 24, marginBottom: 10 },
  newsFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  author: { fontSize: 14, color: '#666' },
  likes: { flexDirection: 'row', alignItems: 'center' },
  likesCount: { marginLeft: 6, color: '#666', fontSize: 14 },
  tagBadge: { backgroundColor: '#f0f0f0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tagBadgeText: { fontSize: 12, color: '#666' },
});