import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../../supabase';
import { Colors } from '../../../constants/ThemeColor';

export default function WorkoutDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkout = async () => {
      const { data, error } = await supabase
        .from('workouts')
        .select('id, title, description, duration, calories')
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Failed to load workout:', error);
      } else {
        setWorkout(data);
      }

      setLoading(false);
    };

    if (id) fetchWorkout();
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 10 }}>Loading workout...</Text>
      </View>
    );
  }

  if (!workout) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Workout not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: Colors.background }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', color: Colors.text, marginBottom: 10 }}>{workout.title}</Text>
      <Text style={{ fontSize: 16, color: Colors.secondary, marginBottom: 6 }}>{workout.description}</Text>
      <Text style={{ fontSize: 16 }}>⏱ Duration: {workout.duration} min</Text>
      <Text style={{ fontSize: 16, marginBottom: 16 }}>🔥 Calories: {workout.calories} kcal</Text>

      <Pressable
        onPress={() => router.push(`/workout/${id}/steps`)}
        style={{ backgroundColor: Colors.primary, padding: 14, borderRadius: 10, marginBottom: 12 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16 }}>Start Workout</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/weight')}
        style={{ backgroundColor: Colors.card, padding: 14, borderRadius: 10, marginBottom: 12 }}
      >
        <Text style={{ color: Colors.primary, textAlign: 'center', fontSize: 16 }}>
          Track Weight & Get Workout Advice
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.back()}
        style={{ backgroundColor: Colors.secondary, padding: 14, borderRadius: 10 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontSize: 16 }}>Back</Text>
      </Pressable>
    </ScrollView>
  );
}