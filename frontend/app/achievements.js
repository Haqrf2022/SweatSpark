import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, Image } from 'react-native';
import { Colors } from '../constants/ThemeColor';
import { useRouter } from 'expo-router';
import Logo from '../components/ui/Logo';

const mockBadges = [
  { id: '1', title: 'First Workout', description: 'Completed your first workout!', tag: 'New' },
  { id: '2', title: '5 Days Streak', description: 'Worked out 5 days in a row!', tag: 'Streak' },
  { id: '3', title: 'Burn 1000 kcal', description: 'Burned a total of 1000 kcal!', tag: 'Milestone' },
];

export default function AchievementsScreen() {
  const [badges] = useState(mockBadges);
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, padding: 20 }}>
      <Image
        source={require('../assets/images/logo.png')}
        style={{ width: 100, height: 100, alignSelf: 'center', marginBottom: 20 }}
        resizeMode="contain"
      />

      <Text style={{ fontSize: 26, fontWeight: 'bold', color: Colors.text, marginBottom: 20, textAlign: 'center' }}>
        Achievements
      </Text>

      <FlatList
        data={badges}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: Colors.card,
              padding: 16,
              borderRadius: Colors.borderRadius,
              marginBottom: 12,
              borderWidth: 1,
              borderColor: '#eee',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.primary }}>
              🏅 {item.title} <Text style={{ fontSize: 14, color: Colors.secondary }}>({item.tag})</Text>
            </Text>
            <Text style={{ color: Colors.text, marginTop: 5 }}>{item.description}</Text>
          </View>
        )}
      />

      <Pressable
        onPress={() => router.back()}
        style={{
          backgroundColor: Colors.primary,
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: Colors.borderRadius,
          alignItems: 'center',
          alignSelf: 'center',
          marginTop: 20,
        }}
      >
        <Text style={{ color: Colors.buttonText, fontSize: 16 }}>Back</Text>
      </Pressable>
    </View>
  );
}
