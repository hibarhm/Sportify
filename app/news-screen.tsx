// app/news-screen.tsx
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function NewsScreen() {
  const router = useRouter();

  // Using placeholder images from the internet (works 100% — no path error)
  const newsList = [
    {
      title: 'Real Madrid secures dramatic last-minute victory in Champions League opener',
      author: 'Elena Petrova',
      likes: 234,
      tag: 'Check',
      image: 'https://via.placeholder.com/400x200/007AFF/FFFFFF?text=Real+Madrid',
    },
    {
      title: 'Lakers dominate rival team with stellar performance from new star recruit',
      author: 'Marcus Chen',
      likes: 187,
      tag: 'Volleyball',
      image: 'https://via.placeholder.com/400x200/FF9500/FFFFFF?text=Lakers',
    },
    {
      title: 'Serena Williams makes a stunning comeback at the US Open',
      author: 'Chloe Dupont',
      likes: 98,
      tag: 'Tennis',
      image: 'https://via.placeholder.com/400x200/34C759/FFFFFF?text=Serena',
    },
    {
      title: 'Brazil clinches world championship title in an epic five-set thriller',
      author: 'Juan Ramirez',
      likes: 112,
      tag: 'Volleyball',
      image: 'https://via.placeholder.com/400x200/FF3B30/FFFFFF?text=Brazil',
    },
  ];

  const tags = ['All', 'Check', 'Volleyball', 'Tennis'];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>News</Text>
        <TouchableOpacity>
          <Feather name="search" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Tags */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsContainer}>
        {tags.map((tag, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tag, tag === 'All' && styles.activeTag]}
          >
            <Text style={[styles.tagText, tag === 'All' && styles.activeTagText]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* News List */}
      <View style={styles.newsList}>
        {newsList.map((item, index) => (
          <View key={index} style={styles.newsCard}>
            <Image source={{ uri: item.image }} style={styles.newsImage} />
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <View style={styles.newsFooter}>
                <Text style={styles.author}>{item.author}</Text>
                <View style={styles.likes}>
                  <Feather name="heart" size={16} color="#FF3B30" />
                  <Text style={styles.likesCount}>{item.likes}</Text>
                </View>
                <View style={styles.tagBadge}>
                  <Text style={styles.tagBadgeText}>{item.tag}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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
  newsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    lineHeight: 24,
    marginBottom: 10,
  },
  newsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  author: { fontSize: 14, color: '#666' },
  likes: { flexDirection: 'row', alignItems: 'center' },
  likesCount: { marginLeft: 6, color: '#666', fontSize: 14 },
  tagBadge: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagBadgeText: { fontSize: 12, color: '#666' },
});