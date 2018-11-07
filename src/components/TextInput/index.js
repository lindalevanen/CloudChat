import React from 'react';
import { TextInput as RNTextInput, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f0f0f0ff',
    padding: 12,
    borderRadius: 4,
    fontSize: 16,
  },
});

const TextInput = ({
  onChangeText, value, placeholder, style, ...props
}) => (
  <RNTextInput
    style={[styles.input, style]}
    onChangeText={onChangeText}
    placeholder={placeholder}
    value={value}
    props={props}
  />
);

export default TextInput;
