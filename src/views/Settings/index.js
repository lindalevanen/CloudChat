import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { withFirebase } from 'react-redux-firebase';

import ProfileSettings from './ProfileSettings';

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
  </ScrollView>
);

export default withFirebase(SettingsView);
