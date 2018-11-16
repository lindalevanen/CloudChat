import React from 'react';
import { View } from 'react-native';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import ProfileInfo from '../../components/ProfileInfo';

const UserInfoScreen = ({ profile, navigation }) => (
  <View>
    <ProfileInfo profile={profile} />
  </View>
);

const enhance = compose(
  firebaseConnect(({ navigation }) => [
    { path: `users/${navigation.state.params.userId}` },
  ]),
  connect(({ firebase }, { navigation }) => ({
    profile: firebase.data.users[navigation.state.params.userId],
  })),
);

export default enhance(UserInfoScreen);
