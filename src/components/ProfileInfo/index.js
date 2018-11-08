import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import Avatar from '../Avatar';

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    borderColor: 'darkgrey',
    borderBottomWidth: 0.3,
  },
  topContainer: {
    padding: 10,
    flexDirection: 'row',
  },
  profileText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

const ProfileInfo = ({ profile }) => (
  <View style={[styles.topContainer, styles.section]}>
    <Avatar url={profile.avatarUrl} />
    <View>
      <Text
        style={[
          styles.profileText,
          { marginTop: 10, marginBottom: 5, fontWeight: 'bold' },
        ]}
      >
        {profile.username}
      </Text>
      <Text style={[styles.profileText, { marginBottom: 10 }]}>
        {profile.email}
      </Text>
    </View>
  </View>
);

export default ProfileInfo;
