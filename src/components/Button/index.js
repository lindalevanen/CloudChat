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
});

const Button = ({
  theme,
  onPress,
  title,
  type,
  disabled,
  style,
  color = theme[`action${type}`] || theme.actionDefault,
  titleStyle,
  titleColor = theme.text1,
  ...props
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    style={[styles.container, { backgroundColor: color, opacity: disabled ? 0.2 : 1 }, style]}
    {...props}
  >
    <Text style={[styles.title, { color: titleColor }, titleStyle]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default withTheme(Button);
