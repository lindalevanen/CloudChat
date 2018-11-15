import React from 'react';
import { Text, View } from 'react-native';

import Avatar from '../Avatar';

const styles = theme => ({
  container: {
    padding: 10,
    flex: 1,
  },
  section: {
    backgroundColor: theme.foreground,
    borderColor: theme.separator,
    borderBottomWidth: 0.3,
  },
  topContainer: {
    padding: 10,
    flexDirection: 'row',
  },
  profileText: {
    marginLeft: 10,
    fontSize: 16,
    color: theme.text1,
  },
});

const ProfileInfo = ({ profile, theme }) => {
  const style = styles(theme);
  return (
    <View style={[style.topContainer, style.section]}>
      <Avatar url={profile.avatarUrl} username={profile.username} />
      <View>
        <Text
          style={[
            style.profileText,
            { marginTop: 10, marginBottom: 5, fontWeight: 'bold' },
          ]}
        >
          {profile.username}
        </Text>
        <Text style={[style.profileText, { marginBottom: 10 }]}>
          {profile.email}
        </Text>
      </View>
    </View>
  );
};

export default ProfileInfo;
