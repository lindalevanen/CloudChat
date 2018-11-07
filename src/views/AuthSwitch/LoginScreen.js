import React from 'react';
import {
  View, Image, Text, StyleSheet,
} from 'react-native';
import { withState, compose } from 'recompose';

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
}) => {
  const submit = () => {
    console.log(email, password);
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
          value={username}
          onChangeText={setUsername}
        />
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={getSubmitActionTitle()} titleColor="white" onPress={submit} />
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
