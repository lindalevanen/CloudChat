import React from 'react';
import { View } from 'react-native';
import { firebaseConnect } from 'react-redux-firebase';
import { withNavigation, StackActions } from 'react-navigation';

import { compose, withState } from 'recompose';
import { connect } from 'react-redux';
import Button from '../../../components/Button';
import TextInput from '../../../components/TextInput';
import { withTheme } from '../../../components/ThemedWrapper';

import { styles } from '../../../styles/form/style';

const ChangeUsernameSheet = ({
  useDarkTheme,
  username,
  setUsername,
  firebase,
  navigation,
}) => {
  const onUsernameSaved = async () => {
    try {
      // Update profile to firebase with firebaseConnect
      // (successful updates flow back to redux)
      await firebase.updateProfile({ username });
      // Go back to the settings view with withNavigation
      navigation.dispatch(StackActions.pop());
    } catch (e) {
      console.log(`Username change failed: ${e}`);
    }
  };
  return (
    <View
      style={[
        styles.view, useDarkTheme && styles.viewDark,
      ]}
    >
      <View style={[
        styles.container, styles.section, useDarkTheme && styles.sectionDark,
      ]}
      >
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={setUsername}
        />
        <Button title="Save" titleColor="white" onPress={onUsernameSaved} />
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  currentUsername: state.firebase.profile.username,
});

const enhance = compose(
  withNavigation,
  withTheme,
  firebaseConnect(),
  connect(mapStateToProps),
  withState('username', 'setUsername', ({ currentUsername }) => currentUsername),
);

export default enhance(ChangeUsernameSheet);
