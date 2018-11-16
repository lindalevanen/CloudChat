import React from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { withTheme } from '../ThemedWrapper';

const styles = theme => ({
  input: {
    backgroundColor: theme.inputBackground,
    color: theme.text1,
    padding: 12,
    borderRadius: 4,
    fontSize: 16,
  },
});

const TextInput = ({
  useDarkTheme,
  theme,
  onChangeText,
  value,
  placeholder,
  style,
  ...props
}) => (
  <RNTextInput
    style={[styles(theme).input, style]}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor={theme.inputPlaceholder}
    value={value}
    keyboardAppearance={useDarkTheme ? 'dark' : 'light'}
    {...props}
  />
);

export default withTheme(TextInput);
