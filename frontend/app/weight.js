// frontend/app/weight.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../supabase';
import { Colors } from '../constants/ThemeColor';
import { useAuth } from '../hooks/AuthProvider';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export default function WeightTrackerScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [weight, setWeight] = useState('');
  const [parsedWeight, setParsedWeight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [advice, setAdvice] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchWeights = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('weight_tracking')
      .select('*')
      .eq('user_id', user?.uid)
      .order('recorded_at', { ascending: true });

    if (error) console.error('❌ Failed to fetch weight history:', error);
    else setHistory(data);

    setLoading(false);
  };

  useEffect(() => {
    if (user?.uid) fetchWeights();
  }, [user]);

  const generateAdvice = (currentWeight) => {
    const w = parseFloat(currentWeight);
    if (!w) return '';
    if (w < 50) return '🧘 You might benefit from Yoga Flow and Strength Training. Intensity: Low';
    if (w <= 70) return '💪 Try Full Body Beginner or HIIT Blast. Intensity: Medium';
    return '🔥 HIIT Blast and Fat Burners are great options. Intensity: High';
  };

  const handleSave = async () => {
    if (!weight) return;
    setLoading(true);
    const parsed = parseFloat(weight);
    setParsedWeight(parsed);

    const payload = { user_id: user?.uid, weight: parsed };
    const { error } = editingId
      ? await supabase.from('weight_tracking').update(payload).eq('id', editingId)
      : await supabase.from('weight_tracking').insert(payload);

    if (error) console.error('❌ Failed to save weight:', error);

    setAdvice(generateAdvice(parsed));
    setWeight('');
    setEditingId(null);
    fetchWeights();
    setModalVisible(true);
  };

  const handleModalClose = async () => {
    setModalVisible(false);

    if (!parsedWeight) return;

    let title = '';
    if (parsedWeight < 50) title = 'Yoga Flow';
    else if (parsedWeight <= 70) title = 'Full Body Beginner';
    else title = 'HIIT Blast';

    const { data, error } = await supabase
      .from('workouts')
      .select('id')
      .ilike('title', `%${title}%`)
      .maybeSingle();

    if (error || !data?.id) {
      console.error('❌ Workout lookup failed:', error);
      return;
    }

    router.push(`/workout/${data.id}`);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('weight_tracking').delete().eq('id', id);
    if (error) console.error('❌ Failed to delete entry:', error);
    else fetchWeights();
  };

  const handleEdit = (entry) => {
    setWeight(entry.weight.toString());
    setEditingId(entry.id);
  };

  const chartData = {
    labels: history.map(entry => new Date(entry.recorded_at).toLocaleDateString()),
    datasets: [
      {
        data: history.map(entry => parseFloat(entry.weight)),
        color: () => Colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  const weightDelta = history.length > 1
    ? parseFloat(history[history.length - 1].weight - history[history.length - 2].weight).toFixed(1)
    : null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: Colors.text, marginBottom: 10 }}>
          Weight Tracker
        </Text>

        <TextInput
          value={weight}
          onChangeText={setWeight}
          placeholder="Enter current weight (kg)"
          keyboardType="decimal-pad"
          style={{
            backgroundColor: Colors.card,
            padding: 10,
            borderRadius: 8,
            color: Colors.text,
            marginBottom: 12,
            fontSize: 14,
          }}
        />

        <Pressable
          onPress={handleSave}
          style={{
            backgroundColor: Colors.primary,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 6,
            alignSelf: 'center',
            marginBottom: 16,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 13 }}>{editingId ? 'Update' : 'Save'}</Text>
        </Pressable>

        {weightDelta && (
          <Text style={{ color: Colors.secondary, marginBottom: 6 }}>
            {weightDelta > 0 ? '⬆️ Gained' : '⬇️ Lost'} {Math.abs(weightDelta)} kg since last entry.
          </Text>
        )}

        {advice && (
          <View style={{ backgroundColor: Colors.card, padding: 12, borderRadius: 8, marginBottom: 20 }}>
            <Text style={{ color: Colors.text }}>{advice}</Text>
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : history.length > 0 ? (
          <>
            <LineChart
              data={chartData}
              width={Dimensions.get('window').width - 40}
              height={220}
              chartConfig={{
                backgroundColor: Colors.card,
                backgroundGradientFrom: Colors.card,
                backgroundGradientTo: Colors.card,
                decimalPlaces: 1,
                color: () => Colors.primary,
                labelColor: () => Colors.text,
              }}
              style={{ borderRadius: 10 }}
            />

            {history.map((entry) => (
              <View
                key={entry.id}
                style={{
                  backgroundColor: Colors.card,
                  padding: 10,
                  borderRadius: 8,
                  marginTop: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: Colors.text, fontSize: 14 }}>
                  {new Date(entry.recorded_at).toLocaleDateString()} - {entry.weight} kg
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <Pressable onPress={() => handleEdit(entry)}>
                    <Text style={{ color: Colors.primary, fontSize: 13, marginRight: 10 }}>Edit</Text>
                  </Pressable>
                  <Pressable onPress={() => handleDelete(entry.id)}>
                    <Text style={{ color: 'red', fontSize: 13, fontWeight: 'bold' }}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </>
        ) : (
          <Text style={{ color: Colors.secondary }}>No weight data yet.</Text>
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000099' }}>
          <View style={{ backgroundColor: Colors.card, padding: 20, borderRadius: 12, width: '80%' }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 10 }}>Workout Advice</Text>
            <Text style={{ color: Colors.text }}>{advice}</Text>
            <Pressable
              onPress={handleModalClose}
              style={{ marginTop: 16, alignSelf: 'flex-end' }}
            >
              <Text style={{ color: Colors.primary }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
