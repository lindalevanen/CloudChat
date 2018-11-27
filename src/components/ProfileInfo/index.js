import React from 'react';
import { Text, View } from 'react-native';

import { styles as formStyles } from '../../styles/form/style';

import { withTheme } from '../ThemedWrapper';
import Avatar from '../Avatar';

const styles = theme => ({
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
  const formStyle = formStyles(theme);
  return (
    <View style={formStyle.view}>
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
    </View>
  );
};

export default withTheme(ProfileInfo);
