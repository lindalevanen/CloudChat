import React from 'react';
import { Image, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderColor: 'darkgrey',
    borderWidth: 0.3,
  },
});

const Avatar = ({
  url,
}) => (
  <Image style={styles.avatar} source={{ url }} />
);

export default Avatar;
