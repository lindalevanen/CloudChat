import React from 'react';
import { Text, View } from 'react-native';
import { compose } from 'recompose';
import { withNavigation, StackActions } from 'react-navigation';

import { styles as formStyles } from '../../styles/form/style';

import { withTheme } from '../ThemedWrapper';
import Avatar from '../Avatar';
import Button from '../Button';

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

const ProfileInfo = ({
  navigation, profile, theme, fromChat, chatId,
}) => {
  const style = styles(theme);
  const formStyle = formStyles(theme);

  const navigateToGallery = () => {
    navigation.dispatch(StackActions.push({
      routeName: 'GalleryScreen',
      params: {
        chatId,
      },
    }));
  };

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
      {fromChat && chatId && (
        <View style={[style.section, style.panel]}>
          <Button
            title="Chat gallery"
            titleStyle={{ alignSelf: 'flex-start' }}
            color="transparent"
            onPress={() => navigateToGallery()}
            titleColor={theme.actionPrimary}
          />
        </View>
      )}
    </View>
  );
};

const enhance = compose(
  withTheme,
  withNavigation,
);

export default enhance(ProfileInfo);
