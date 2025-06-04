import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from 'supabase';
import { Colors } from '../../constants/ThemeColor';

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [workout, setWorkout] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', id)
        .single();

      if (!error) {
        setWorkout(data);
      } else {
        console.error('Error fetching workout:', error);
      }
    };

    if (id) fetchWorkout();
  }, [id]);

  if (!workout) {
    return (
      <View style={styles.centered}>
        <Text>Loading workout...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>{workout.title}</Text>
      <Text style={styles.description}>{workout.description}</Text>
      <Text style={styles.details}>Duration: {workout.duration} min</Text>
      <Text style={styles.details}>Calories: {workout.calories} kcal</Text>

      <Pressable
        onPress={() => router.push(`/workout/${id}/start`)}
        style={styles.startButton}
      >
        <Text style={styles.startText}>START WORKOUT</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: Colors.primary,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  description: {
    color: Colors.secondary,
    marginBottom: 10,
  },
  details: {
    color: Colors.secondary,
    marginBottom: 5,
  },
  startButton: {
    marginTop: 30,
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: Colors.borderRadius,
    alignItems: 'center',
  },
  startText: {
    color: '#fff',
    fontSize: 16,
  },
});
