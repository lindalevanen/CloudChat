import React from 'react';
import {
  Image, Text, View, StyleSheet,
} from 'react-native';
import { withFirebase } from 'react-redux-firebase';

import { compose, withState } from 'recompose';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import Logo from '../../../assets/icon.png';
import { loginChatUser } from '../../store/utils/firebase';

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
  error: {
    textAlign: 'center',
    color: 'red',
  },
});

const LoginForm = ({
  theme, email, setEmail, password, setPassword, error, setError, firebase, onLoggedIn,
}) => {
  const onLoginPressed = async () => {
    try {
      await loginChatUser(firebase, { email, password });
      onLoggedIn();
    } catch (e) {
      const errorMessage = 'Invalid email or password';
      setError(errorMessage);
    }
  };
  return (
    <View>
      <Image key="logo" style={styles.logo} source={Logo} />
      <Text key="title" style={[styles.title, { color: theme.text1 }]}>CloudChat</Text>
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
        disabled={!email || !password}
        title="Login"
        type="Hero"
        onPress={onLoginPressed}
      />
      <Text key="error" style={[styles.error]}>{error}</Text>
    </View>
  );
};

const enhance = compose(
  withFirebase,
  withState('email', 'setEmail', ''),
  withState('password', 'setPassword', ''),
  withState('error', 'setError', ''),
);

export default enhance(LoginForm);
