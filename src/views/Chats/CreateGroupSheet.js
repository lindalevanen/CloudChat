import React from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { firebaseConnect } from 'react-redux-firebase';
import { withNavigation, StackActions } from 'react-navigation';

import { createChatRoom } from '../../store/utils/firebase';
import { withTheme } from '../../components/ThemedWrapper';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import UserSearch from '../../components/UserSearch';

import { styles as formStyles } from '../../styles/form/style';

const CreateGroupSheet = ({
  theme,
  firebase,
  navigation,
  profileId,
  groupName,
  setGroupName,
  logoUrl,
  setLogoUrl,
  userIds,
  setUserIds,
  error,
  setError,
}) => {
  const onCreateGroupPressed = async () => {
    if (groupName && userIds) {
      const chatRoomResult = await createChatRoom(
        firebase,
        true,
        [...userIds, profileId],
        groupName,
        logoUrl,
      );
      console.log(chatRoomResult);
      navigation.dispatch(StackActions.popToTop());
    } else {
      setError("Please fill at least group name and friend's user id");
    }
  };
  const formStyle = formStyles(theme);
  return (
    <SafeAreaView style={[formStyle.view, { paddingBottom: 10 }]}>
      <View style={[formStyle.container, formStyle.panel]}>
        <TextInput
          placeholder="Group name"
          autoCapitalize="none"
          autoCorrect={false}
          value={groupName}
          onChangeText={setGroupName}
        />
      </View>
      <View style={[formStyle.container, formStyle.panel]}>
        <TextInput
          placeholder="Logo url"
          autoCapitalize="none"
          autoCorrect={false}
          value={logoUrl}
          onChangeText={setLogoUrl}
        />
      </View>
      <UserSearch style={{ flex: 1 }} onSelectionDone={setUserIds} />
      <View style={[formStyle.container, formStyle.panel]}>
        <Button
          title="Next"
          titleColor={theme.actionHero}
          color="transparent"
          onPress={onCreateGroupPressed}
        />
      </View>
    </SafeAreaView>
  );
};

export default compose(
  withTheme,
  withNavigation,
  firebaseConnect(),
  connect(state => ({
    profileId: state.firebase.auth.uid,
  })),
  withState('groupName', 'setGroupName'),
  withState('logoUrl', 'setLogoUrl'),
  withState('userIds', 'setUserIds', []),
  withState('error', 'setError'),
)(CreateGroupSheet);
