import React from 'react';
import { StyleSheet } from 'react-native';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Circle';

const styles = StyleSheet.create({
  circle: {
    borderColor: 'darkgrey',
    borderWidth: 0.4,
    backgroundColor: 'white',
  },
  image: {

  },
});

const Avatar = ({ url, size = 60 }) => (
  <Image
    style={[
      { height: size, width: size },
    ]}
    imageStyle={{ ...styles.circle, borderRadius: size / 2 }}
    source={{ uri: url }}
    indicator={ProgressBar}
  />
);

export default Avatar;
