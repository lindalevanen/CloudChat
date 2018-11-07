import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
  },
});

const Button = ({
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
    style={[styles.container, { backgroundColor: color }, style]}
    {...props}
  >
    <Text style={[styles.title, { color: titleColor }, titleStyle]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default Button;
