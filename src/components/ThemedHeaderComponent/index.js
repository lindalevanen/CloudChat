import React from 'react';
import {
  View, StyleSheet, StatusBar,
} from 'react-native';
import { Header } from 'react-navigation';
import { withTheme } from '../ThemedWrapper';

const styles = StyleSheet.create({
  dark: {
    backgroundColor: '#191B2C',
  },
  light: {
    backgroundColor: 'white',
  },
});

const ThemedHeaderComponent = ({
  useDarkTheme, ...props
}) => (
  <View style={useDarkTheme ? styles.dark : styles.light}>
    <StatusBar
      barStyle={useDarkTheme ? 'light-content' : 'dark-content'}
    />
    <Header {...props} />
  </View>
);

export default withTheme(ThemedHeaderComponent);
