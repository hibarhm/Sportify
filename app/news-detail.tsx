// app/news-detail.tsx  ← FIXED: TouchableOpacity imported + fully working
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,   // ← THIS WAS MISSING!
} from 'react-native';
import WebView from 'react-native-webview';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from './context/ThemeContext';

export default function NewsDetail() {
  const { url, title } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      {/* Custom Header */}
      <View style={[styles.header, { backgroundColor: colors.header, borderBottomColor: colors.border }]}> 
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={28} color={colors.icon} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {title || 'News Article'}
        </Text>
        <View style={{ width: 40 }} />
      </View>
      {/* Full article inside app */}
      <WebView
        source={{ uri: url as string }}
        style={{ flex: 1, backgroundColor: colors.background }}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={[styles.loading, { backgroundColor: colors.background }]}> 
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading article...</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: { padding: 5 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#000', flex: 1, marginLeft: 10 },
  loading: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: { marginTop: 16, color: '#666' },
});