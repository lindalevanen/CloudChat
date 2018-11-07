import React from 'react';
import {
  View, Image, Text, StyleSheet,
} from 'react-native';
import { withState, compose } from 'recompose';
import { connect as reduxConnect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

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
  reduxConnect(({ firebase: { auth } }) => ({ auth })),
  withState('debug', 'setDebugMessage', ''),
  withState('isRegistering', 'setIsRegistering', false),
  withState('username', 'setUsername', ''),
  withState('email', 'setEmail', ''),
  withState('password', 'setPassword', ''),
);

const LoginScreen = ({
  debug,
  setDebugMessage,
  isRegistering,
  setIsRegistering,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  firebase,
  auth,
}) => {
  const submit = async () => {
    try {
      let result;
      if (isRegistering) {
        result = await firebase.createUser(
          { email, password, signIn: true },
          { username },
        );
      } else {
        result = await firebase.login({ email, password });
      }
      setDebugMessage(result);
    } catch (e) {
      setDebugMessage(e);
    }
  };
  const getSubmitActionTitle = () => (isRegistering ? 'Register' : 'Login');
  const getToggleActionTitle = () => (isRegistering ? 'Login to existing account' : 'Register new account');
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={Logo} />
      <Text style={styles.title}>CloudChat</Text>
      <Text>{JSON.stringify(auth, null, 2)}</Text>
      <Text>{JSON.stringify(debug, null, 2)}</Text>
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
