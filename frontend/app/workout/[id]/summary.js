import React, { useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../../constants/ThemeColor';
import { supabase } from '../../../supabase';
import { useAuth } from '../../../hooks/AuthProvider';

export default function WorkoutSummaryScreen() {
  const { id, duration } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const logWorkout = async () => {
      if (!user?.uid || !id || !duration) return;
      const parsedDuration = parseInt(duration);

      const { error } = await supabase.from('workout_history').insert({
        user_id: user.uid,
        workout_id: id,
        duration_seconds: parsedDuration,
      });

      if (error) {
        console.error('❌ Failed to log workout:', error);
        Alert.alert('Error', 'Workout not saved. Please try again.');
      } else {
        console.log('✅ Workout logged to history');
      }
    };

    logWorkout();
  }, [id, duration, user]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 40, marginBottom: 20 }}>🎉</Text>

      <Text style={{ fontSize: 26, fontWeight: 'bold', color: Colors.text, marginBottom: 10 }}>
        Workout Complete!
      </Text>

      <Text style={{ fontSize: 16, color: Colors.secondary, marginBottom: 30 }}>
        Great job on finishing your workout. Stay consistent and keep moving!
      </Text>

      <Pressable
        onPress={() => router.push('/history')}
        style={{
          backgroundColor: Colors.primary,
          padding: 15,
          borderRadius: Colors.borderRadius,
          width: '80%',
          alignItems: 'center',
          marginBottom: 15,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>View History</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/')}
        style={{
          backgroundColor: Colors.secondary,
          padding: 15,
          borderRadius: Colors.borderRadius,
          width: '80%',
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>Back to Home</Text>
      </Pressable>
    </View>
  );
}
