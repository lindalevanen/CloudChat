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

const NoImageAvailable = ({ username, style }) => (
  <View style={[styles.circle, styles.placeHolder, style]}>
    <Text style={{ fontSize: 22, color: 'white' }}>{username.substring(0, 2).toUpperCase()}</Text>
  </View>
);

const noUrl = url => url === undefined || url === '';

const Avatar = ({ url, username, size = 60 }) => (noUrl(url) ? (
  <NoImageAvailable
    style={[{ height: size, width: size, borderRadius: size / 2 }]}
    username={username}
  />
) : (
  <Image
    style={[{ height: size, width: size }]}
    imageStyle={{ ...styles.circle, borderRadius: size / 2 }}
    source={{ uri: url }}
    indicator={ProgressBar}
  />
));

export default Avatar;
