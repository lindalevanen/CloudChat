import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { withFirebase } from 'react-redux-firebase';
import { compose } from 'recompose';

import ProfileSettings from './ProfileSettings';
import ThemeSettings from './ThemeSettings';

const styles = StyleSheet.create({
  container: {
  },
});

const SettingsView = ({
  firebase,
  navigation,
}) => (
  <ScrollView styles={styles.container}>
    <ProfileSettings />
    <ThemeSettings />
  </ScrollView>
);

export default withFirebase(SettingsView);
