import React from 'react';
import {
  View, StyleSheet,
} from 'react-native';
import { withState, compose } from 'recompose';
import { firebaseConnect } from 'react-redux-firebase';
import { registerForPushNotificationsAsync } from '../../store/utils/firebase';
import Button from '../../components/Button';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { withTheme } from '../../components/ThemedWrapper';

const styles = theme => ({
  container: {
    flex: 1,
    padding: 40,
    paddingTop: 160,
    justifyContent: 'space-between',
    backgroundColor: theme.foreground,
  },
  registerButton: {
    marginTop: 10,
  },
});

const enhancer = compose(
  withTheme,
  firebaseConnect(),
  withState('isRegistering', 'setIsRegistering', false),
);

const LoginScreen = ({
  theme, isRegistering, setIsRegistering, navigation, firebase,
}) => {
  const getToggleActionTitle = () => (isRegistering ? 'Login to existing account' : 'Register new account');
  const onLoggedIn = async () => {
    const newId = firebase.auth().currentUser.uid;
    try {
      registerForPushNotificationsAsync(firebase, newId);
    } catch (e) {
      console.log(e);
    }
    navigation.navigate('App');
  };
  const style = styles(theme);
  return (
    <View style={style.container}>
      { !isRegistering
        ? <LoginForm key="loginForm" theme={theme} navigation={navigation} onLoggedIn={onLoggedIn} />
        : (
          <RegisterForm
            theme={theme}
            style={{ marginTop: 104 }}
            navigation={navigation}
            onLoggedIn={onLoggedIn}
          />
        )}
      <Button
        style={style.registerButton}
        title={getToggleActionTitle()}
        onPress={() => setIsRegistering(!isRegistering)}
        titleColor={theme.actionHero}
        color="transparent"
      />
    </View>
  );
};

export default enhancer(LoginScreen);
