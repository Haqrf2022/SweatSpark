// frontend/app/workouts.js

import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../supabase';
import { Colors } from '../constants/ThemeColor';

export default function WorkoutsScreen() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const { data, error } = await supabase
        .from('workouts')
        .select('id, title, description, duration, calories')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching workouts:', error);
      } else {
        // Optional deduplication by title
        const unique = [];
        const seenTitles = new Set();
        for (const workout of data) {
          if (!seenTitles.has(workout.title)) {
            unique.push(workout);
            seenTitles.add(workout.title);
          }
        }
        setWorkouts(unique);
      }
    };
    fetchWorkouts();
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', margin: 20, color: Colors.text }}>
        Available Workouts
      </Text>

      {workouts.map((workout) => (
        <View
          key={workout.id}
          style={{
            backgroundColor: Colors.card,
            padding: 14,
            marginHorizontal: 16,
            marginBottom: 12,
            borderRadius: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 3,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.text }}>{workout.title}</Text>
          <Text style={{ fontSize: 13, color: Colors.secondary }} numberOfLines={1}>
            {workout.description}
          </Text>
          <Text style={{ fontSize: 12, color: Colors.secondary }}>
            Duration: {workout.duration} min · Calories: {workout.calories} kcal
          </Text>

          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Pressable
              onPress={() => router.push(`/workout/${workout.id}/details`)}
              style={{
                flex: 1,
                backgroundColor: Colors.primary,
                padding: 10,
                borderRadius: 8,
                marginRight: 8,
              }}
            >
              <Text style={{ color: Colors.buttonText, textAlign: 'center', fontSize: 14 }}>View Details</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push(`/workout/${workout.id}/steps`)}
              style={{
                flex: 1,
                backgroundColor: Colors.secondary,
                padding: 10,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#fff', textAlign: 'center', fontSize: 14 }}>Start</Text>
            </Pressable>
          </View>
        </View>
      ))}

      <Pressable
        onPress={() => router.push('/')}
        style={{
          backgroundColor: Colors.primary,
          padding: 14,
          borderRadius: Colors.borderRadius,
          alignItems: 'center',
          margin: 20,
        }}
      >
        <Text style={{ color: Colors.buttonText, fontSize: 16 }}>Back to Home</Text>
      </Pressable>
    </ScrollView>
  );
}
