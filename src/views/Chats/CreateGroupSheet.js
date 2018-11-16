import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { firebaseConnect } from 'react-redux-firebase';
import { withNavigation, StackActions } from 'react-navigation';

import { createChatRoom } from '../../store/utils/firebase';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import UserSearch from '../../components/UserSearch';

const randomChatIcon = 'https://cdn0.iconfinder.com/data/icons/chat-2/100/Chat-05-512.png';

const CreateGroupSheet = ({
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
  return (
    <View style={{ flex: 1 }}>
      <TextInput
        placeholder="Group name"
        autoCapitalize="none"
        autoCorrect={false}
        value={groupName}
        onChangeText={setGroupName}
      />
      <TextInput
        placeholder="Logo url"
        autoCapitalize="none"
        autoCorrect={false}
        value={logoUrl}
        onChangeText={setLogoUrl}
      />
      <UserSearch onSelectionDone={setUserIds} />
      <Text>{userIds.join(',')}</Text>
      <Button
        title="Create group!"
        titleColor="white"
        onPress={onCreateGroupPressed}
      />
      {error && <Text>{error}</Text>}
    </View>
  );
};

export default compose(
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
