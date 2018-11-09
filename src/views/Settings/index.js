import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { withFirebase } from 'react-redux-firebase';

import { compose } from 'recompose';
import ProfileSettings from './ProfileSettings';
import ThemeSettings from './ThemeSettings';
import { withTheme } from '../../components/ThemedWrapper';

const styles = StyleSheet.create({
  dark: {
    backgroundColor: '#262636',
  },
});

const SettingsView = ({ useDarkTheme }) => (
  <ScrollView style={useDarkTheme && styles.dark}>
    <ProfileSettings useDarkTheme={useDarkTheme} />
    <ThemeSettings useDarkTheme={useDarkTheme} />
  </ScrollView>
);

const enhance = compose(
  withTheme,
  withFirebase,
);

export default enhance(SettingsView);
