import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { firebaseConnect } from 'react-redux-firebase';

import { createChatRoom } from '../../store/utils/firebase';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import { styles } from '../../styles/form/style';

const randomChatIcon = "https://cdn0.iconfinder.com/data/icons/chat-2/100/Chat-05-512.png"

const InitChat = ({ 
  firebase,
  profileId,
  groupName,
  setGroupName,
  logoUrl, 
  setLogoUrl,
  userId,
  setUserId,
  error,
  setError
}) => {
  const onCreateGroupPressed = async () => {
    if(groupName && userId) {
      const chatRoomResult = await createChatRoom(
        firebase,
        true,
        [userId, profileId],
        groupName,
        logoUrl ? logoUrl : randomChatIcon
      );
      console.log(chatRoomResult)

    } else {
      setError("omg fill all fields")
    }
  }
  return (
    <View>
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
      <TextInput
        placeholder="Friend's user id"
        autoCapitalize="none"
        autoCorrect={false}
        value={userId}
        onChangeText={setUserId}
      />
      <Button
        title="Create group!"
        titleColor="white"
        onPress={onCreateGroupPressed}
      />
      {error && <Text>{error}</Text>}
  </View>
  )
};

export default compose(
  firebaseConnect(),
  connect(state => ({
    profileId: state.firebase.auth.uid,
  })),
  withState('groupName', 'setGroupName'),
  withState('logoUrl', 'setLogoUrl'),
  withState('userId', 'setUserId'),
  withState('error', 'setError')
)(InitChat);
