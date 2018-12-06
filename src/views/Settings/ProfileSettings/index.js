import React from 'react';
import { View } from 'react-native';
import { withFirebase } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withNavigation, StackActions } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { unsubscribePushNotificationsAsync } from '../../../store/utils/firebase';

import Button from '../../../components/Button';
import ProfileInfo from '../../../components/ProfileInfo';

import { styles } from '../../../styles/form/style';
import colors from '../../../styles/colors';

const Preferences = ({
  navigation, firebase, theme, auth,
}) => {
  const logout = async () => {
    await unsubscribePushNotificationsAsync(firebase, auth.uid);
    await firebase.logout();
    navigation.navigate('Login');
  };
  const openChangeUsernameSheet = () => navigation.dispatch(
    StackActions.push({
      routeName: 'ChangeUsernameSheet',
    }),
  );
  const openAvatarSelectorSheet = () => navigation.dispatch(
    StackActions.push({
      routeName: 'AvatarSelectorSheet',
    }),
  );
  const style = styles(theme);
  return (
    <View style={[style.section, style.panel]}>
      <View style={[style.setting, style.container]}>
        <View style={style.settingTitle}>
          <Button
            title="Change avatar"
            onPress={openAvatarSelectorSheet}
            color="transparent"
            style={{ padding: 0 }}
            titleStyle={{ alignSelf: 'flex-start' }}
          />
        </View>
      </View>
      <View style={[style.setting, style.container]}>
        <View style={style.settingTitle}>
          <Button
            title="Change username"
            onPress={openChangeUsernameSheet}
            color="transparent"
            style={{ padding: 0 }}
            titleStyle={{ alignSelf: 'flex-start' }}
          />
        </View>
      </View>
      <View style={[style.setting, style.container]}>
        <View style={style.settingTitle}>
          <Button
            title="Logout"
            onPress={logout}
            titleColor="red"
            color="transparent"
            style={{ padding: 0 }}
            titleStyle={{ alignSelf: 'flex-start' }}
          />
        </View>
      </View>
    </View>
  );
};

const ProfileSettings = ({
  profile, navigation, firebase, theme, auth,
}) => (
  <View>
    <ProfileInfo profile={profile} theme={theme} />
    <Preferences navigation={navigation} firebase={firebase} theme={theme} auth={auth} />
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
