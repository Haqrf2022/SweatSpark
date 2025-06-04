import React, { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks/AuthProvider';
import { supabase } from '../supabase';
import { Colors } from '../constants/ThemeColor';
import Logo from '../components/ui/Logo';

export default function IndexScreen() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        setTimeout(() => {
          router.replace('/login');
        }, 0);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.uid)
        .single();

      if (error || !data) {
        setTimeout(() => {
          router.replace('/profile');
        }, 0);
        return;
      }
    };

    checkProfile();
  }, [user]);

  const handleLogout = () => {
    signOut(auth);
  };

  if (!user) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
      <Logo width={120} height={120} style={{ marginBottom: 20 }} />

      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: Colors.text }}>
        Welcome, {user.email}!
      </Text>

      <Pressable
        onPress={handleLogout}
        style={{
          backgroundColor: Colors.primary,
          paddingVertical: 12,
          paddingHorizontal: 25,
          borderRadius: Colors.borderRadius,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: Colors.buttonText, fontSize: 16 }}>Logout</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/workouts')}
        style={{
          backgroundColor: Colors.primary,
          paddingVertical: 12,
          paddingHorizontal: 25,
          borderRadius: Colors.borderRadius,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: Colors.buttonText, fontSize: 16 }}>View Workouts</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/history')}
        style={{
          backgroundColor: Colors.primary,
          paddingVertical: 12,
          paddingHorizontal: 25,
          borderRadius: Colors.borderRadius,
        }}
      >
        <Text style={{ color: Colors.buttonText, fontSize: 16 }}>Workout History</Text>
      </Pressable>
    </View>
  );
}
