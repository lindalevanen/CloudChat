import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { withTheme } from '../ThemedWrapper';

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
  },
  dark: {
    // backgroundColor: '#191B2C',
  },
});

const Button = ({
  useDarkTheme,
  onPress,
  title,
  style,
  color = 'tomato',
  titleStyle,
  titleColor,
  ...props
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.container, { backgroundColor: color }, style, useDarkTheme && styles.dark]}
    {...props}
  >
    <Text style={[styles.title, { color: titleColor }, titleStyle]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default withTheme(Button);
