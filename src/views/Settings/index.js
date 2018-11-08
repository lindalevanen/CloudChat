import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { withFirebase } from 'react-redux-firebase';

import ProfileView from '../Profile';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
});

const SettingsView = ({
  firebase,
  navigation,
}) => (
  <ScrollView styles={styles.container}>
    <ProfileView navigation={navigation} />
  </ScrollView>
);

export default withFirebase(SettingsView);
