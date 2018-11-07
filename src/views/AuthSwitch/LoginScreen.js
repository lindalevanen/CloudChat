import React from 'react';
import {
  View, Image, Text, StyleSheet,
} from 'react-native';
import { withState, compose } from 'recompose';
import { firebaseConnect } from 'react-redux-firebase';

import { createChatUser, loginChatUser } from '../../store/utils/firebase';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import Logo from '../../../assets/icon.png';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 40,
    marginBottom: 200,
  },
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
  registerButton: {
    marginTop: 10,
  },
});

const enhancer = compose(
  firebaseConnect(),
  withState('isRegistering', 'setIsRegistering', false),
  withState('username', 'setUsername', ''),
  withState('email', 'setEmail', ''),
  withState('password', 'setPassword', ''),
);

const LoginScreen = ({
  isRegistering,
  setIsRegistering,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  firebase,
  navigation,
}) => {
  const submit = async () => {
    try {
      let result;
      if (isRegistering) {
        const avatarUrl = 'https://firebasestorage.googleapis.com/v0/b/snazzy-narwhal-on-fire.appspot.com/o/icon.png?alt=media&token=0f162cf6-8b1e-4c27-9d7c-b653bb01381a';
        result = await createChatUser(firebase, { email, password, signIn: true }, {
          username, email, avatarUrl,
        });
      } else {
        result = await loginChatUser({ email, password });
      }
      console.log('login result', result);
      navigation.navigate('App');
    } catch (e) {
      console.log('User login failed:', e);
    }
  };
  const getSubmitActionTitle = () => (isRegistering ? 'Register' : 'Login');
  const getToggleActionTitle = () => (isRegistering ? 'Login to existing account' : 'Register new account');
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={Logo} />
      <Text style={styles.title}>CloudChat</Text>
      {isRegistering ? (
        <TextInput
          style={styles.input}
          placeholder="username"
          autoCapitalize="none"
          autoCorrect={false}
          value={username}
          onChangeText={setUsername}
        />
      ) : null}
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
      <Button
        title={getSubmitActionTitle()}
        titleColor="white"
        onPress={submit}
      />
      <Button
        style={styles.registerButton}
        title={getToggleActionTitle()}
        titleColor="tomato"
        onPress={() => setIsRegistering(!isRegistering)}
        color="transparent"
      />
    </View>
  );
};

export default enhancer(LoginScreen);
