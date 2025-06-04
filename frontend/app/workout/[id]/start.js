import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from 'supabase';
import { useAuth } from '../../../hooks/AuthProvider';
import { Colors } from '../../../constants/ThemeColor';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

export default function WorkoutStartScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { id } = useLocalSearchParams();

  const [workout, setWorkout] = useState(null);
  const [steps, setSteps] = useState([]);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const [sound, setSound] = useState(null);

  const logWorkoutCompletion = async () => {
    const { error } = await supabase
      .from('history')
      .insert([{
        user_id: user.uid,
        workout_id: workout.id,
        title: workout.title,
        duration: workout.duration,
        calories: workout.calories
      }]);

    if (error) {
      console.error('Error saving history:', error);
    } else {
      console.log('Workout saved to history!');
    }
  };

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../../assets/sounds/completion.mp3')
    );
    setSound(sound);
    await sound.playAsync();
  };

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  useEffect(() => {
    const fetchWorkout = async () => {
      const { data, error } = await supabase
        .from('workouts')
        .select('*')
        .eq('id', id)
        .single();

      if (!error) {
        setWorkout(data);
        setSteps(data.steps || []);
        setTimeLeft(120); // hardcoded for testing
      }
    };

    if (id) fetchWorkout();
  }, [id]);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (isRunning && timeLeft === 0 && !workoutComplete) {
      setIsRunning(false);
      setWorkoutComplete(true);
      logWorkoutCompletion();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      playSound();
      router.push(`/workout/${id}/summary`);
    }
    return () => clearTimeout(timer);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(120);
      setWorkoutComplete(false);
    }
    if (!isRunning) {
      setIsRunning(true);
    }
  };

  const handlePause = () => setIsRunning(false);

  if (!user) {
    router.replace('/login');
    return <Text>Loading...</Text>;
  }

  if (!workout) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 10 }}>Loading workout...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, padding: 20 }}>
      <Pressable
        onPress={() => router.back()}
        style={{ marginBottom: 20, padding: 10, alignSelf: 'flex-start' }}
      >
        <Text style={{ fontSize: 16, color: Colors.primary }}>← Back</Text>
      </Pressable>

      <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 26, fontWeight: 'bold', color: Colors.text, marginBottom: 10 }}>
          {workout.title}
        </Text>
        <Text style={{ color: Colors.secondary }}>{workout.description}</Text>
        <Text style={{ color: Colors.secondary, marginTop: 5 }}>
          Duration: {workout.duration} min
        </Text>
        <Text style={{ color: Colors.secondary }}>
          Calories: {workout.calories} kcal
        </Text>

        <Text style={{ fontSize: 48, fontWeight: 'bold', marginVertical: 30, color: Colors.text }}>
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </Text>

        {workoutComplete && (
          <Text style={{ fontSize: 20, color: 'green', marginBottom: 10 }}>
            🎉 Workout Complete!
          </Text>
        )}

        <Pressable
          onPress={() => router.push(`/workout/${id}/steps`)}
          style={{
            backgroundColor: Colors.secondary,
            padding: 10,
            borderRadius: Colors.borderRadius,
            width: 200,
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>View Steps</Text>
        </Pressable>

        {isRunning ? (
          <Pressable
            onPress={handlePause}
            style={{
              backgroundColor: Colors.secondary,
              padding: 15,
              borderRadius: Colors.borderRadius,
              width: 200,
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>Pause</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleStart}
            style={{
              backgroundColor: Colors.primary,
              padding: 15,
              borderRadius: Colors.borderRadius,
              width: 200,
              alignItems: 'center',
              marginBottom: 10,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>
              {timeLeft === 0 ? "Restart Workout" : "Start"}
            </Text>
          </Pressable>
        )}

        <Pressable
          onPress={() => router.push(`/workout/${id}`)}
          style={{
            backgroundColor: Colors.primary,
            padding: 15,
            borderRadius: Colors.borderRadius,
            width: 200,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>Back to Workout</Text>
        </Pressable>
      </View>
    </View>
  );
}
