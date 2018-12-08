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

const validateUsername = value => value.length > 0;

const ChangeUsernameSheet = ({
  theme,
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
  const style = styles(theme);
  const isValid = validateUsername(username);
  return (
    <View style={[style.view]}>
      <View style={[style.container, style.panel]}>
        <TextInput
          style={style.input}
          placeholder="Username"
          placeholderTextColor={theme.inputPlaceholder}
          autoCapitalize="none"
          autoCorrect={false}
          validate={validateUsername}
          value={username}
          onChangeText={setUsername}
        />
        <Button title="Save" onPress={onUsernameSaved} color="transparent" titleColor={theme.actionHero} disabled={!isValid} />
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
