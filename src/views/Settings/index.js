import React from 'react';
import { View, StyleSheet } from 'react-native';
import { withFirebase } from 'react-redux-firebase';

import Button from '../../components/Button';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
});

const SettingsView = ({
  firebase,
  navigation,
}) => {
  const logout = async () => {
    await firebase.logout();
    navigation.navigate('Login');
  };
  return (
    <View styles={styles.container}>
      <Button title="Logout" onPress={logout} titleColor="white" />
    </View>
  );
};

export default withFirebase(SettingsView);
