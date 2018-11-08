import React from 'react';
import {
  Text, View, StyleSheet,
} from 'react-native';
import { createSwitchNavigator } from 'react-navigation';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
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
  componentWillReceiveProps(props) {
    const { auth, navigation } = props;
    if (props !== this.props && auth.isLoaded) {
      navigation.navigate(!auth.isEmpty ? 'App' : 'Login');
      SplashScreen.hide();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.firebase.auth,
});

const enhance = compose(
  firebaseConnect(),
  connect(mapStateToProps),
);
const ConnectedAuthLoadingScreen = enhance(AuthLoadingScreen);

export default createSwitchNavigator(
  {
    AuthLoading: ConnectedAuthLoadingScreen,
    App: HomeScreen,
    Login: LoginScreen,
  },
  {
    initialRouteName: 'AuthLoading',
  },
);
