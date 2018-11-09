import React from 'react';
import { StyleSheet } from 'react-native';
import { BottomTabBar } from 'react-navigation-tabs';
import { withTheme } from '../../components/ThemedWrapper';

const styles = StyleSheet.create({
  dark: {
    backgroundColor: '#191B2C',
  },
  light: {},
});

const ThemedTabBarComponent = ({ useDarkTheme, ...props }) => (
  <BottomTabBar
    {...props}
    style={useDarkTheme ? styles.dark : styles.light}
    inactiveTintColor={useDarkTheme ? '#7C8997' : 'grey'}
  />
);

export default withTheme(ThemedTabBarComponent);
