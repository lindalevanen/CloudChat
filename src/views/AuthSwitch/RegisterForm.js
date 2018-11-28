import React from 'react';
import { View, StyleSheet } from 'react-native';
import { compose, withState } from 'recompose';
import StepIndicator from 'react-native-step-indicator';

import { withFirebase } from 'react-redux-firebase';
import { createChatUser } from '../../store/utils/firebase';

import TextInput from '../../components/TextInput';
import Avatar from '../../components/Avatar';
import Button from '../../components/Button';

import stepStyles from './stepStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  avatarContainer: {
    padding: 10,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 10,
  },
  stepIndicatorContainer: {
    marginBottom: 200,
  },
});

const AccountForm = ({
  email, setEmail, password, setPassword, setStep,
}) => (
  <View>
    <TextInput
      style={styles.input}
      placeholder="email"
      autoCapitalize="none"
      autoCorrect={false}
      value={email}
      onChangeText={setEmail}
    />
    <TextInput
      style={styles.input}
      placeholder="password"
      autoCapitalize="none"
      autoCorrect={false}
      secureTextEntry
      value={password}
      onChangeText={setPassword}
    />
  </View>
);

const ProfileForm = ({
  email,
  password,
  username,
  setUsername,
  setStep,
  firebase,
  onLoggedIn,
}) => {
  const onRegisterPressed = async () => {
    try {
      const avatarUrl = 'https://firebasestorage.googleapis.com/v0/b/snazzy-narwhal-on-fire.appspot.com/o/icon.png?alt=media&token=0f162cf6-8b1e-4c27-9d7c-b653bb01381a';
      const result = await createChatUser(
        firebase,
        { email, password, signIn: true },
        {
          username,
          email,
          avatarUrl,
          chats: {
            exists: true,
          },
        },
      );
      console.log('register result', result);
      onLoggedIn();
    } catch (e) {
      console.log('User login failed:', e);
    }
  };
  return (
    <View>
      <View style={styles.avatarContainer}>
        <Avatar url="https://firebasestorage.googleapis.com/v0/b/snazzy-narwhal-on-fire.appspot.com/o/icon.png?alt=media&token=0f162cf6-8b1e-4c27-9d7c-b653bb01381a" />
      </View>
      <TextInput
        style={styles.input}
        placeholder="username"
        autoCapitalize="none"
        autoCorrect={false}
        value={username}
        onChangeText={setUsername}
      />
      <Button onPress={onRegisterPressed} title="Register" titleColor="white" />
    </View>
  );
};

const enhance = compose(
  withFirebase,
  withState('step', 'setStep', 0),
  withState('email', 'setEmail', ''),
  withState('password', 'setPassword', ''),
  withState('username', 'setUsername', ''),
);

const RegisterForm = ({
  step, setStep, style, ...props
}) => (
  <View style={[styles.container, style]}>
    {step === 0 && <AccountForm {...props} />}
    {step === 1 && <ProfileForm {...props} />}
    <View style={styles.stepIndicatorContainer}>
      <StepIndicator
        stepCount={2}
        onPress={setStep}
        currentPosition={step}
        customStyles={stepStyles}
        labels={['Login details', 'Profile']}
      />
    </View>
  </View>
);

export default enhance(RegisterForm);
