import React from 'react';
import { TextInput as RNTextInput, StyleSheet } from 'react-native';
import { withTheme } from '../ThemedWrapper';

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f0f0f0ff',
    padding: 12,
    borderRadius: 4,
    fontSize: 16,
  },
  dark: {
    backgroundColor: '#373C60',
    color: 'white',
  },
});

const TextInput = ({
  useDarkTheme,
  onChangeText,
  value,
  placeholder,
  style,
  ...props
}) => (
  <RNTextInput
    style={[styles.input, useDarkTheme && styles.dark, style]}
    onChangeText={onChangeText}
    placeholder={placeholder}
    value={value}
    {...props}
  />
);

export default withTheme(TextInput);
