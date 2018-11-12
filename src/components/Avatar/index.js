import React from 'react';
import { Image, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  avatar: {
    borderColor: 'darkgrey',
    borderWidth: 0.3,
  },
});

const Avatar = ({
  url,
  size = 60,
}) => (
  <Image style={[styles.avatar, { height: size, width: size, borderRadius: size / 2 }]} source={{ uri: url }} />
);

export default Avatar;
