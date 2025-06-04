import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.replace('/profile');
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text>Signup</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderBottomWidth: 1 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderBottomWidth: 1, marginTop: 10 }} />
      {error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
      <Button title="Signup" onPress={handleSignup} />
      <Button title="Go to Login" onPress={() => router.push('/login')} />
    </View>
  );
}
