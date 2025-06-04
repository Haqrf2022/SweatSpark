// frontend/app/profile.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/AuthProvider';
import { supabase } from '../supabase';
import { Colors } from '../constants/ThemeColor';

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('name, age, weight')
        .eq('id', user.id)
        .single();

      if (data) {
        setName(data.name || '');
        setAge(data.age?.toString() || '');
        setWeight(data.weight?.toString() || '');
      }

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
      }

      setLoading(false);
    };

    loadProfile();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!name || !age || !weight) {
      Alert.alert('Please fill all fields');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        name,
        age: parseInt(age),
        weight: parseFloat(weight),
      });

    if (error) {
      console.error('Supabase error:', error);
      Alert.alert('Failed to save profile');
    } else {
      Alert.alert('Profile saved!');
      router.replace('/');
    }
  };

  if (!user || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 10 }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, padding: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', color: Colors.text, marginBottom: 20 }}>
        Complete Your Profile
      </Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={{
          backgroundColor: Colors.card,
          borderRadius: Colors.borderRadius,
          padding: 12,
          marginBottom: 12,
          fontSize: 16,
          borderWidth: 1,
          borderColor: '#ddd',
          color: Colors.text,
        }}
      />
      <TextInput
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        style={{
          backgroundColor: Colors.card,
          borderRadius: Colors.borderRadius,
          padding: 12,
          marginBottom: 12,
          fontSize: 16,
          borderWidth: 1,
          borderColor: '#ddd',
          color: Colors.text,
        }}
      />
      <TextInput
        placeholder="Weight (kg)"
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
        style={{
          backgroundColor: Colors.card,
          borderRadius: Colors.borderRadius,
          padding: 12,
          marginBottom: 20,
          fontSize: 16,
          borderWidth: 1,
          borderColor: '#ddd',
          color: Colors.text,
        }}
      />

      <Pressable
        onPress={handleSaveProfile}
        style={{
          backgroundColor: Colors.primary,
          padding: 12,
          borderRadius: Colors.borderRadius,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: Colors.buttonText, fontSize: 15 }}>Save Profile</Text>
      </Pressable>
    </View>
  );
}
