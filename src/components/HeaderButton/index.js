import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../../styles/colors';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    color: colors.actionHero,
  },
});

const HeaderButton = ({
  navigation, onPress, title, children,
}) => (
  <TouchableOpacity style={styles.container} onPress={onPress}>
    {title ? <Text style={styles.title}>{title}</Text> : null}
    {children}
  </TouchableOpacity>
);

export default HeaderButton;
