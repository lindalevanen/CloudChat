import React from 'react';
import {
  Text, View, Image, StyleSheet, ScrollView,
} from 'react-native';
import { withFirebase } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { StackActions } from 'react-navigation';

import Button from '../../components/Button';
import Avatar from '../../components/Avatar';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    borderColor: 'darkgrey',
    borderBottomWidth: 0.3,
  },
  topContainer: {
    padding: 10,
    flexDirection: 'row',
  },
  profileText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

const ProfileSettings = ({ navigation }) => {
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
    </View>
  );
};

const ProfileView = ({ auth, profile, navigation }) => (
  <ScrollView styles={styles.container}>
    <View style={[styles.topContainer, styles.section]}>
      <Avatar url={profile.avatarUrl} />
      <View>
        <Text style={[styles.profileText, { marginTop: 10, marginBottom: 5, fontWeight: 'bold' }]}>{profile.username}</Text>
        <Text style={[styles.profileText, { marginBottom: 10 }]}>{profile.email}</Text>
      </View>
    </View>
    <ProfileSettings navigation={navigation} />
    <Text>Raw auth data:</Text>
    <Text>{JSON.stringify(auth.providerData, '', 3)}</Text>
    <Text>Raw profile data:</Text>
    <Text>{JSON.stringify(profile, '', 3)}</Text>
  </ScrollView>
);

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile,
});

const enhance = compose(
  withFirebase,
  connect(mapStateToProps),
);

export default enhance(ProfileView);
