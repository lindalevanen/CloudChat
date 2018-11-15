import React from 'react';
import { StyleSheet } from 'react-native';
import { BottomTabBar } from 'react-navigation-tabs';
import { withTheme } from '../../components/ThemedWrapper';

const styles = theme => StyleSheet.create({
  container: {
    backgroundColor: theme.bottomBar,
  },
});

const ThemedTabBarComponent = ({ theme, ...props }) => (
  <BottomTabBar
    {...props}
    style={styles(theme).container}
    activeTintColor={theme.barIconActive}
    inactiveTintColor={theme.barIconInactive}
  />
);

export default withTheme(ThemedTabBarComponent);
