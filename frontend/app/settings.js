// frontend/app/settings.js

import React, { useState } from 'react';
import { View, Text, Switch, Pressable, Alert } from 'react-native';
import { Colors } from '../constants/ThemeColor';

export default function SettingsScreen() {
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSave = () => {
    // Here you could persist to AsyncStorage or Supabase
    Alert.alert('Settings saved!', `Reminders: ${remindersEnabled ? 'On' : 'Off'} | Sound: ${soundEnabled ? 'On' : 'Off'}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, padding: 20 }}>
      <Text style={{ fontSize: 26, fontWeight: 'bold', color: Colors.text, marginBottom: 20 }}>
        Settings
      </Text>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, color: Colors.text, marginBottom: 10 }}>
          Workout Reminders
        </Text>
        <Switch
          value={remindersEnabled}
          onValueChange={setRemindersEnabled}
          trackColor={{ false: '#ccc', true: Colors.primary }}
          thumbColor="#fff"
        />
      </View>

      <View style={{ marginBottom: 30 }}>
        <Text style={{ fontSize: 18, color: Colors.text, marginBottom: 10 }}>
          Sound Effects
        </Text>
        <Switch
          value={soundEnabled}
          onValueChange={setSoundEnabled}
          trackColor={{ false: '#ccc', true: Colors.primary }}
          thumbColor="#fff"
        />
      </View>

      <Pressable
        onPress={handleSave}
        style={{
          backgroundColor: Colors.primary,
          padding: 15,
          borderRadius: Colors.borderRadius,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: Colors.buttonText, fontSize: 16 }}>Save Settings</Text>
      </Pressable>
    </View>
  );
}
