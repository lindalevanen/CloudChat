import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import Button from '../../components/Button';
import TextInput from '../../components/TextInput';

const InitGroupChat = ({ 
  firebase, 
  groupName,
  setGroupName,
  logoUrl, 
  setLogoUrl,
  userId,
  setUserId,
  error,
  setError
}) => {
  const handleCreatePress = async () => {
    if(groupName && userId) {
      // TODO: create room
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
      {error}
  </View>
  )
}
);

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
