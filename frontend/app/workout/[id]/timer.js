// frontend/app/workout/[id]/timer.js
import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../../constants/ThemeColor';
import { supabase } from '../../../supabase';
import { useAuth } from '../../../hooks/AuthProvider';

export default function WorkoutTimerScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (!startTime) setStartTime(Date.now());

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const handleFinish = async () => {
    if (!user?.uid || !id) return;

    const duration_seconds = Math.floor((Date.now() - startTime) / 1000);

    const { error } = await supabase.from('workout_history').insert({
      user_id: user.uid,
      workout_id: id,
      completed_at: new Date().toISOString(),
      duration_seconds,
    });

    if (error) {
      console.error('❌ Failed to log workout:', error);
      Alert.alert('Error', 'Could not save workout.');
    } else {
      router.push({ pathname: `/workout/${id}/summary`, params: { duration: duration_seconds.toString() } });
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16, color: Colors.text }}>⏱ Workout Timer</Text>
      <Text style={{ fontSize: 48, color: Colors.primary, marginBottom: 30 }}>{elapsed} sec</Text>

      <Pressable
        onPress={handleFinish}
        style={{ backgroundColor: Colors.primary, padding: 16, borderRadius: 12 }}
      >
        <Text style={{ color: '#fff', fontSize: 18 }}>Finish Workout</Text>
      </Pressable>
    </View>
  );
}
