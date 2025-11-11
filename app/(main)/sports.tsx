// app/(main)/sports.tsx
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Sports() {
  const router = useRouter();

  const sportsList = [
    { name: 'Football', icon: 'check', type: 'feather', matches: 5, color: '#007AFF' },
    { name: 'Basketball', icon: 'sports-basketball', type: 'material', matches: 3, color: '#FF9500' },
    { name: 'Tennis', icon: 'cloud', type: 'feather', matches: 2, color: '#34C759' },
    { name: 'Baseball', icon: 'play-circle-outline', type: 'ion', matches: 4, color: '#FF3B30' },
    { name: 'Golf', icon: 'flag', type: 'feather', matches: 1, color: '#AF52DE' },
    { name: 'Volleyball', icon: 'sports-volleyball', type: 'material', matches: 3, color: '#5856D6' },
    { name: 'Racing', icon: 'zap', type: 'feather', matches: 6, color: '#FF2D55' },
    { name: 'Athletics', icon: 'award', type: 'feather', matches: 0, color: '#8E8E93' },
  ];

  const renderIcon = (icon: string, type: string, color: string) => {
    if (type === 'material') {
      return <MaterialIcons name={icon as any} size={40} color={color} />;
    }
    if (type === 'ion') {
      return <Ionicons name={icon as any} size={40} color={color} />;
    }
    return <Feather name={icon as any} size={40} color={color} />;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Sports</Text>
        <TouchableOpacity>
          <Feather name="search" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* EXTRA TOP SPACING — CLEAN & PREMIUM LOOK */}
      <View style={styles.topSpacing} />

      {/* Sports Grid */}
      <View style={styles.grid}>
        {sportsList.map((sport, index) => (
          <TouchableOpacity key={index} style={styles.card} activeOpacity={0.7}>
            {renderIcon(sport.icon, sport.type, sport.color)}
            <Text style={styles.sportName}>{sport.name}</Text>
            <Text style={styles.matches}>
              {sport.matches} ongoing {sport.matches === 1 ? 'match' : 'matches'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  topSpacing: {
    height: 40, // ← THIS IS YOUR NEW BREATHING SPACE — ADJUST IF YOU WANT MORE/LESS
    backgroundColor: '#f8f9fa',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    width: '46%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 16,
  },
  sportName: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  matches: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
  },
});