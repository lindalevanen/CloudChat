import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  title: {
    color: 'tomato',
  },
});

const HeaderButton = ({ navigation, onPress, title }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <Text style={styles.title}>{title}</Text>
  </TouchableOpacity>
);

export default HeaderButton;
