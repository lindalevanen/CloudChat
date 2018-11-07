import React from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import { withState, compose } from 'recompose';
import { firebaseConnect } from 'react-redux-firebase';

import Button from '../../components/Button';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    marginTop: 100,
    justifyContent: 'space-between',
  },
  registerButton: {
    marginTop: 10,
  },
});

const enhancer = compose(
  firebaseConnect(),
  withState('isRegistering', 'setIsRegistering', false),
);

const LoginScreen = ({ isRegistering, setIsRegistering, navigation }) => {
  const getToggleActionTitle = () => (isRegistering ? 'Login to existing account' : 'Register new account');
  const onLoggedIn = () => navigation.navigate('App');
  return (
    <View style={styles.container}>
      { !isRegistering
        ? <LoginForm key="loginForm" navigation={navigation} onLoggedIn={onLoggedIn} />
        : (
          <RegisterForm
            style={{ marginTop: 104 }}
            navigation={navigation}
            onLoggedIn={onLoggedIn}
          />
        )}
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
