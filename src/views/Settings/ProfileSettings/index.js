import React from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import { withFirebase } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withNavigation, StackActions } from 'react-navigation';

import Button from '../../../components/Button';
import ProfileInfo from '../../../components/ProfileInfo';

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'white',
    borderColor: 'darkgrey',
    borderBottomWidth: 0.3,
  },
});

const Preferences = ({ navigation, firebase }) => {
  const logout = async () => {
    await firebase.logout();
    navigation.navigate('Login');
  };
  const openChangeUsernameSheet = () => navigation.dispatch(StackActions.push({
    routeName: 'ChangeUsernameSheet',
  }));
  const openAvatarSelectorSheet = () => navigation.dispatch(StackActions.push({
    routeName: 'AvatarSelectorSheet',
  }));
  return (
    <View>
      <View style={[styles.section]}>
        <Button title="Change avatar" onPress={openAvatarSelectorSheet} titleColor="tomato" color="transparent" style={{ alignSelf: 'flex-start' }} />
      </View>
      <View style={[styles.section]}>
        <Button title="Change username" onPress={openChangeUsernameSheet} titleColor="tomato" color="transparent" style={{ alignSelf: 'flex-start' }} />
      </View>
      <View style={[styles.section]}>
        <Button title="Logout" onPress={logout} titleColor="red" color="transparent" style={{ alignSelf: 'flex-start' }} />
      </View>
    </View>
  );
};

const ProfileSettings = ({
  profile, navigation, firebase,
}) => (
  <View>
    <ProfileInfo profile={profile} />
    <Preferences navigation={navigation} firebase={firebase} />
  </View>
);

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile,
});

const enhance = compose(
  withNavigation,
  withFirebase,
  connect(mapStateToProps),
);

export default enhance(ProfileSettings);
