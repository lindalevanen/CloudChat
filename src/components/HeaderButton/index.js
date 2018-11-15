import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  title: {
    color: colors.blush,
  },
});

const HeaderButton = ({ navigation, onPress, title }) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    <Text style={styles.title}>{title}</Text>
  </TouchableOpacity>
);

export default HeaderButton;
