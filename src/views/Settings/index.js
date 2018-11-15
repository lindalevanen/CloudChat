import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { withFirebase } from 'react-redux-firebase';

import { compose } from 'recompose';
import ProfileSettings from './ProfileSettings';
import ThemeSettings from './ThemeSettings';
import { withTheme } from '../../components/ThemedWrapper';

const styles = theme => ({
  container: {
    backgroundColor: theme.backdrop,
  },
});

const SettingsView = ({ theme }) => (
  <ScrollView style={styles(theme).container}>
    <ProfileSettings theme={theme} />
    <ThemeSettings theme={theme} />
  </ScrollView>
);

const enhance = compose(
  withTheme,
  withFirebase,
);

export default enhance(SettingsView);
