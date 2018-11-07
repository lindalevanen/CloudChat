import React from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';
import { createSwitchNavigator } from 'react-navigation';
import { SplashScreen } from 'expo';

import HomeScreen from '../HomeScreen';
import LoginScreen from './LoginScreen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    const authenticated = false; // authenticate with firebase
    setTimeout(() => {
      const { navigation } = this.props;
      SplashScreen.hide();
      navigation.navigate(authenticated ? 'App' : 'Login');
    }, 200);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>loading</Text>
      </View>
    );
  }
}

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: HomeScreen,
    Login: LoginScreen,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);
