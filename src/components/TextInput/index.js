import React from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { withTheme } from '../ThemedWrapper';

const styles = theme => ({
  input: {
    backgroundColor: theme.inputBackground,
    color: theme.text1,
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    borderColor: 'transparent',
    borderWidth: 0.5,
  },
});

const TextInput = ({
  useDarkTheme,
  theme,
  onChangeText,
  value,
  placeholder,
  style,
  validate,
  ...props
}) => {
  const isValid = validate(value);
  return (
    <RNTextInput
      style={[styles(theme).input, style, !isValid ? { borderColor: theme.actionHero, borderWidth: 0.5 } : null]}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.inputPlaceholder}
      value={value}
      keyboardAppearance={useDarkTheme ? 'dark' : 'light'}
      {...props}
    />
  );
};

export default withTheme(TextInput);
