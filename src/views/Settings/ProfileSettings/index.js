import React from 'react';
import {
  View,
} from 'react-native';
import { withFirebase } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withNavigation, StackActions } from 'react-navigation';

import Button from '../../../components/Button';
import ProfileInfo from '../../../components/ProfileInfo';

import { styles } from '../../../styles/form/style';

const Preferences = ({ navigation, firebase, theme }) => {
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
  const style = styles(theme);
  return (
    <View>
      <View style={[style.section]}>
        <Button title="Change avatar" onPress={openAvatarSelectorSheet} color="transparent" titleStyle={{ alignSelf: 'flex-start' }} />
      </View>
      <View style={[style.section]}>
        <Button title="Change username" onPress={openChangeUsernameSheet} color="transparent" titleStyle={{ alignSelf: 'flex-start' }} />
      </View>
      <View style={[style.section]}>
        <Button title="Logout" onPress={logout} titleColor="red" color="transparent" titleStyle={{ alignSelf: 'flex-start' }} />
      </View>
    </View>
  );
};

const ProfileSettings = ({
  profile, navigation, firebase, theme,
}) => (
  <View>
    <ProfileInfo profile={profile} theme={theme} />
    <Preferences navigation={navigation} firebase={firebase} theme={theme} />
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
