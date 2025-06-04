// frontend/components/ui/Logo.js
import React from 'react';
import { Image } from 'react-native';

export default function Logo({ size = 100, style }) {
  return (
    <Image
      source={require('../../assets/images/logo.png')}
      style={[
        { width: size, height: size, alignSelf: 'center', marginBottom: 20 },
        style,
      ]}
      resizeMode="contain"
    />
  );
}
