import React from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';
import { firebaseConnect } from 'react-redux-firebase';
import { withNavigation, StackActions } from 'react-navigation';

import { compose, withState } from 'recompose';
import Button from '../../../components/Button';
import TextInput from '../../../components/TextInput';

const styles = StyleSheet.create({
  logo: {
    height: 60,
    width: 60,
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
});

const ChangeUsernameSheet = ({
  username, setUsername, firebase, navigation,
}) => {
  const onUsernameSaved = async () => {
    try {
      // Update profile to redux & firebase with firebaseConnect
      await firebase.updateProfile({ username });
      // Go to the settings view with withNavigation
      navigation.dispatch(StackActions.pop({
        n: 1,
      }));
    } catch (e) {
      console.log(`User login failed: ${e}`);
    }
  };
  return (
    <View>
      <Text key="title" styles={styles.title}>Change your username</Text>
      <TextInput
        style={styles.input}
        placeholder="username"
        autoCapitalize="none"
        autoCorrect={false}
        value={username}
        onChangeText={setUsername}
      />
      <Button
        title="Save"
        titelColor="white"
        onPress={onUsernameSaved}
      />
    </View>
  );
};

const enhance = compose(
  firebaseConnect(),
  withNavigation,
  withState('username', 'setUsername', ''),
);


export default enhance(ChangeUsernameSheet);
