import React from 'react';
import { BottomTabBar } from 'react-navigation-tabs';
import { withTheme } from '../../components/ThemedWrapper';

const styles = theme => ({
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
