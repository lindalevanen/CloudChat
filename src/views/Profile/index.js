import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import Button from '../../components/Button';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
});

const ProfileView = ({
  params,
}) => (
  <View styles={styles.container}>
    <Text>ProfileView</Text>
    <Button title="Logout" color="transparent" titleColor="tomato" />
  </View>
);

export default ProfileView;
