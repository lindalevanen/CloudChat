import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Header } from 'react-navigation';
import { withTheme } from './ThemedWrapper';

const styles = StyleSheet.create({
  dark: {
    backgroundColor: '#191B2C',
  },
  light: {
    backgroundColor: 'red',
  },
});

const ThemedHeaderComponent = ({ useDarkTheme, ...props }) => (
  <View>
    <Header {...props} style={useDarkTheme ? styles.dark : styles.light} />
  </View>
);

export default withTheme(ThemedHeaderComponent);
