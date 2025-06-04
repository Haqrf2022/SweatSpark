import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../../supabase';
import { Colors } from '../../../constants/ThemeColor';
import { useAuth } from '../../../hooks/AuthProvider';
import { WebView } from 'react-native-webview';

export default function WorkoutStepsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    const fetchSteps = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('workout_steps')
        .select('id, step_number, name, description, duration, reps, video_url')
        .eq('workout_id', id)
        .order('step_number', { ascending: true });

      if (!error) {
        setSteps(data);
        setStartTime(Date.now());
      } else {
        console.error('Error fetching steps:', error);
      }

      setLoading(false);
    };

    if (id) fetchSteps();
  }, [id]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
      router.push(`/workout/${id}/timer?duration=${durationSeconds}`);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 10 }}>Loading workout steps...</Text>
      </View>
    );
  }

  if (steps.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No steps found for this workout.</Text>
      </View>
    );
  }

  const step = steps[currentStepIndex];
  const isValidVideo = step.video_url && step.video_url.includes('http');

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.background, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.text, marginBottom: 10 }}>
        Step {currentStepIndex + 1} of {steps.length}
      </Text>
      <Text style={{ fontSize: 20, fontWeight: '600', color: Colors.text }}>{step.name}</Text>

      {step.description && (
        <Text style={{ fontSize: 16, color: Colors.secondary, marginVertical: 10 }}>
          {step.description}
        </Text>
      )}

      {step.duration && <Text style={{ fontSize: 16 }}>⏱ {step.duration} seconds</Text>}
      {step.reps && <Text style={{ fontSize: 16 }}>💪 {step.reps} reps</Text>}

      {isValidVideo ? (
        Platform.OS === 'web' ? (
          <View style={{ height: 220, marginTop: 16, borderRadius: 10, overflow: 'hidden' }}>
            <iframe
              src={step.video_url}
              title="Workout Video"
              style={{ width: '100%', height: '100%', border: 'none' }}
              allowFullScreen
            />
          </View>
        ) : (
          <View style={{ height: 220, marginTop: 16, borderRadius: 10, overflow: 'hidden' }}>
            <WebView source={{ uri: step.video_url }} />
          </View>
        )
      ) : (
        <Text style={{ color: Colors.secondary, marginTop: 16 }}>🎬 No video available for this step.</Text>
      )}

      <View style={{ flexDirection: 'row', marginTop: 30, justifyContent: 'space-between' }}>
        <Pressable
          onPress={handleBack}
          style={{
            backgroundColor: Colors.secondary,
            padding: 12,
            borderRadius: 10,
            flex: 1,
            marginRight: 10,
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>Back</Text>
        </Pressable>

        <Pressable
          onPress={handleNext}
          style={{
            backgroundColor: Colors.primary,
            padding: 12,
            borderRadius: 10,
            flex: 1,
            marginLeft: 10,
          }}
        >
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            {currentStepIndex === steps.length - 1 ? 'Start Timer' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
