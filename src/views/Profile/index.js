import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'recompose';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
});

const ProfileView = ({
  auth,
}) => (
  <View styles={styles.container}>
    <Text>Raw auth data:</Text>
    <Text>{JSON.stringify(auth.providerData, '', 3)}</Text>
  </View>
);

const mapStateToProps = state => ({
  auth: state.firebase.auth,
});

const enhance = compose(
  firebaseConnect(),
  connect(mapStateToProps),
);

export default enhance(ProfileView);
