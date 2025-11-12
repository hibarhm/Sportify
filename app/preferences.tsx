// app/preferences.tsx
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function Preferences() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(['Football']);

  // REAL SPORTS LIST
  const sports = [
    { name: 'Football', icon: 'youtube', color: '#FF3B30' },
    { name: 'Cricket', icon: 'grid', color: '#34C759' },
    { name: 'Volleyball', icon: 'activity', color: '#007AFF' },
    { name: 'Basketball', icon: 'shuffle', color: '#FF9500' },
    { name: 'Tennis', icon: 'target', color: '#FF2D55' },
    { name: 'Rugby', icon: 'hexagon', color: '#5856D6' },
    { name: 'Badminton', icon: 'feather', color: '#AF52DE' },
    { name: 'Swimming', icon: 'droplet', color: '#00C2FF' },
    { name: 'Athletics', icon: 'zap', color: '#FFCC00' },
    { name: 'Boxing', icon: 'shield', color: '#8E8E93' },
  ];

  const toggleSport = (name: string) => {
    setSelected(prev =>
      prev.includes(name)
        ? prev.filter(i => i !== name)
        : [...prev, name]
    );
  };

  const handleSave = () => {
    // Later: Save to AsyncStorage or backend
    router.push('/(main)'); // Go to Home
  };

  return (
    <View style={styles.container}>
      {/* CLEAN WHITE HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Preferences</Text>
      </View>

      <Text style={styles.subtitle}>Your Interests</Text>
      <Text style={styles.description}>
        Select your favorite sports to personalize your feed.
      </Text>

      {/* SPORTS LIST */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {sports.map((sport, index) => (
          <TouchableOpacity
            key={index}
            style={styles.item}
            onPress={() => toggleSport(sport.name)}
          >
            <View style={styles.left}>
              <Feather
                name={sport.icon}
                size={26}
                color={selected.includes(sport.name) ? sport.color : '#888'}
              />
              <Text style={[
                styles.itemText,
                selected.includes(sport.name) && styles.selectedText
              ]}>
                {sport.name}
              </Text>
            </View>

            <View style={[
              styles.checkbox,
              selected.includes(sport.name) && styles.checked
            ]}>
              {selected.includes(sport.name) && (
                <Feather name="check" size={18} color="#fff" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* SAVE BUTTON */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Preferences</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 70,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff', // CLEAN WHITE
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  subtitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 20,
    marginTop: 10,
  },
  description: {
    fontSize: 15,
    color: '#666',
    marginLeft: 20,
    marginBottom: 20,
    lineHeight: 20,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  itemText: {
    fontSize: 17,
    color: '#333',
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#000',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    marginBottom: 50,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});