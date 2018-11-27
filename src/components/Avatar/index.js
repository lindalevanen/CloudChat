import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Circle';

const styles = StyleSheet.create({
  circle: {
    borderColor: 'darkgrey',
    borderWidth: 0.4,
    backgroundColor: 'white',
  },
  placeHolder: {
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const NoImageAvailable = ({ username, size }) => (
  <View style={[styles.circle, styles.placeHolder, { height: size, width: size, borderRadius: size / 2 }]}>
    <Text style={{ fontSize: size === 60 ? 22 : undefined, color: 'white' }}>{username.substring(0, 2).toUpperCase()}</Text>
  </View>
);

const noUrl = url => url === undefined || url === '';

const Avatar = ({ url, username = '', size = 60 }) => (noUrl(url) ? (
  <NoImageAvailable
    size={size}
    username={username}
  />
) : (
  <Image
    style={[{ height: size, width: size }]}
    imageStyle={{ ...styles.circle, borderRadius: size / 2 }}
    source={{ uri: url, cache: 'force-cache' }}
    indicator={ProgressBar}
  />
));

export default Avatar;
