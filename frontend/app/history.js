// frontend/app/history.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { supabase } from '../supabase';
import { useAuth } from '../hooks/AuthProvider';
import { Colors } from '../constants/ThemeColor';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HistoryScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('completed_at');

  useEffect(() => {
    const loadSortPref = async () => {
      const stored = await AsyncStorage.getItem('sort_preference');
      if (stored) setSortBy(stored);
    };
    loadSortPref();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('workout_history')
        .select(`id, completed_at, duration_seconds, weight, workouts ( title, duration, calories, type )`)
        .eq('user_id', user.uid)
        .order(sortBy, { ascending: false });

      if (error) {
        console.error('❌ Error fetching history:', error);
        Alert.alert('Error', 'Failed to load workout history.');
      } else {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setHistory(data);
      }
      setLoading(false);
    };

    if (user?.uid) fetchHistory();
  }, [user, sortBy]);

  const setAndStoreSortBy = async (key) => {
    await AsyncStorage.setItem('sort_preference', key);
    setSortBy(key);
  };

  const exportToCSV = () => {
    const csv = [
      ['Title', 'Type', 'Duration (min)', 'Calories', 'Session Time (min)', 'Weight (kg)', 'Completed At'],
      ...history.map((entry) => [
        entry.workouts?.title,
        entry.workouts?.type || 'N/A',
        entry.workouts?.duration,
        entry.workouts?.calories,
        entry.duration_seconds ? (entry.duration_seconds / 60).toFixed(1) : '--',
        entry.weight || '--',
        new Date(entry.completed_at).toLocaleString(),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    console.log('📤 CSV Export:\n' + csv);
    Alert.alert('Export Complete', 'CSV exported to console (you can implement download).');
  };

  const handleLongPressDelete = async () => {
    Alert.alert('Confirm Reset', 'Delete all workout history?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete All', style: 'destructive', onPress: async () => {
          const { error } = await supabase.from('workout_history').delete().eq('user_id', user.uid);
          if (error) console.error('❌ Failed to reset history:', error);
          else setHistory([]);
        },
      },
    ]);
  };

  const getTrendIcon = (curr, prev) => {
    if (prev == null) return '';
    if (curr > prev) return '🔼';
    if (curr < prev) return '🔽';
    return '⏺';
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 10 }}>Loading workout history...</Text>
      </View>
    );
  }

  const filteredHistory = history; // don't filter out incomplete entries

  return (
    <ScrollView style={{ flex: 1, padding: 20, backgroundColor: Colors.background }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: Colors.text }}>
        🏋️ Workout History
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
        <Pressable
          onPress={() => setAndStoreSortBy('completed_at')}
          style={{ padding: 10, backgroundColor: Colors.card, borderRadius: Colors.borderRadius }}
        >
          <Text style={{ color: Colors.text }}>Sort by Date</Text>
        </Pressable>
        <Pressable
          onPress={() => setAndStoreSortBy('duration_seconds')}
          style={{ padding: 10, backgroundColor: Colors.card, borderRadius: Colors.borderRadius }}
        >
          <Text style={{ color: Colors.text }}>Sort by Session Time</Text>
        </Pressable>
        <Pressable
          onPress={exportToCSV}
          style={{ padding: 10, backgroundColor: Colors.card, borderRadius: Colors.borderRadius }}
        >
          <Text style={{ color: Colors.text }}>Export</Text>
        </Pressable>
      </View>

      {filteredHistory.length === 0 ? (
        <Text style={{ fontSize: 16, color: Colors.secondary }}>No workouts completed yet.</Text>
      ) : (
        filteredHistory.map((entry, index) => {
          const prev = filteredHistory[index + 1];
          const calorieTrend = prev ? getTrendIcon(entry.workouts?.calories, prev.workouts?.calories) : '';
          const durationTrend = prev ? getTrendIcon(entry.duration_seconds, prev.duration_seconds) : '';
          const isIntense = entry.duration_seconds && (entry.duration_seconds / 60 >= entry.workouts?.duration);

          return (
            <TouchableOpacity
              key={entry.id}
              onLongPress={handleLongPressDelete}
              style={{
                backgroundColor: Colors.card,
                padding: 16,
                marginBottom: 12,
                borderRadius: Colors.borderRadius,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.primary }}>
                {entry.workouts?.title || 'Untitled Workout'} {entry.workouts?.type === 'HIIT' ? '🏃' : entry.workouts?.type === 'Yoga' ? '🧘' : ''}
              </Text>
              <Text style={{ color: Colors.text }}>Workout Plan: {entry.workouts?.duration} min</Text>
              <Text style={{ color: Colors.text }}>Calories: {entry.workouts?.calories} kcal {calorieTrend}</Text>
              <Text style={{ color: Colors.text }}>Your Session: {entry.duration_seconds ? (entry.duration_seconds / 60).toFixed(1) : '--'} min {durationTrend}</Text>
              <Text style={{ color: Colors.text }}>Weight: {entry.weight || '--'} kg</Text>
              <Text style={{ color: isIntense ? 'orange' : Colors.secondary }}>
                {entry.duration_seconds
                  ? (isIntense ? '🔥 Intense' : '⚡ Short')
                  : '⚠️ Not Logged Properly'}
              </Text>
              <Text style={{ color: Colors.secondary }}>
                Completed At: {new Date(entry.completed_at).toLocaleString()}
              </Text>
            </TouchableOpacity>
          );
        })
      )}

      <Pressable
        style={{
          backgroundColor: Colors.primary,
          padding: 12,
          borderRadius: Colors.borderRadius,
          alignItems: 'center',
          marginTop: 20,
        }}
        onPress={() => router.push('/')}
      >
        <Text style={{ color: Colors.buttonText, fontSize: 15 }}>Back to Home</Text>
      </Pressable>
    </ScrollView>
  );
}
