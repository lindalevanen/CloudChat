import React from 'react';
import { StyleSheet } from 'react-native';
import { BottomTabBar } from 'react-navigation-tabs';
import { withTheme } from '../../components/ThemedWrapper';

const styles = StyleSheet.create({
  dark: {
    backgroundColor: '#191B2C',
  },
  light: {

  },
});

const ThemedTabBarComponent = ({ useDarkTheme, ...props }) => (
  <BottomTabBar style={useDarkTheme ? styles.dark : styles.light} {...props} />
);

export default withTheme(ThemedTabBarComponent);
