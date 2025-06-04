import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore</Text>
      <Text>This app includes example code to help you get started.</Text>

      <Text style={styles.subtitle}>File-based routing</Text>
      <Text>
        This app has two screens: app/(tabs)/index.tsx and app/(tabs)/explore.tsx.
      </Text>
      <Text>
        The layout file in app/(tabs)/_layout.tsx sets up the tab navigator.
      </Text>

      <Text style={styles.subtitle}>Platform</Text>
      <Text>
        Running on: {Platform.OS.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: '600',
  },
});
