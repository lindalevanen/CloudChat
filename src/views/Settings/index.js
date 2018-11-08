import React from 'react';
import { ScrollView } from 'react-native';
import { withFirebase } from 'react-redux-firebase';

import ProfileSettings from './ProfileSettings';
import ThemeSettings from './ThemeSettings';

const SettingsView = () => (
  <ScrollView>
    <ProfileSettings />
    <ThemeSettings />
  </ScrollView>
);

export default withFirebase(SettingsView);
