import React from 'react';
import { ScrollView } from 'react-native';
import { withFirebase } from 'react-redux-firebase';

import { compose } from 'recompose';
import ProfileSettings from './ProfileSettings';
import GeneralSettings from './GeneralSettings';
import { withTheme } from '../../components/ThemedWrapper';

const styles = theme => ({
  container: {
    backgroundColor: theme.backdrop,
  },
});

const SettingsView = ({ theme }) => (
  <ScrollView style={styles(theme).container}>
    <ProfileSettings theme={theme} />
    <GeneralSettings theme={theme} />
  </ScrollView>
);

const enhance = compose(
  withTheme,
  withFirebase,
);

export default enhance(SettingsView);
