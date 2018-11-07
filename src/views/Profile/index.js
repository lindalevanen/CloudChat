import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { withFirebase } from 'react-redux-firebase';


import Button from '../../components/Button';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
});

const ProfileView = ({
  firebase,
}) => {
  const logout = () => firebase.logout();
  return (
    <View styles={styles.container}>
      <Text>ProfileView</Text>
      <Button title="Logout" color="transparent" titleColor="tomato" onPress={logout} />
    </View>
  );
};

export default withFirebase(ProfileView);
