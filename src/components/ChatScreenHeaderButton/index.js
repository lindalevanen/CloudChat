import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { StackActions } from 'react-navigation';

import colors from '../../styles/colors';
import Avatar from '../Avatar';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    color: colors.blush,
  },
});

const openInfoScreen = (routeName, navigation, params) => () => navigation.dispatch(
  StackActions.push({
    routeName,
    params,
  }),
);

export const OneToOneChatHeaderButton = ({ navigation }) => {
  const { userId, username, avatarUrl } = navigation.state.params;
  const screenParams = {
    headerTitle: username,
    userId,
  };
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={openInfoScreen('UserInfoScreen', navigation, screenParams)}
    >
      <Avatar size={30} url={avatarUrl} username={username} />
    </TouchableOpacity>
  );
};

const ChatScreenHeaderButton = ({ navigation }) => {
  const {
    headerTitle, chatName, chatId, chatAvatarUrl, isGroupChat, userId,
  } = navigation.state.params;

  const routeName = isGroupChat ? 'ChatInfoScreen' : 'UserInfoScreen';
  const screenParams = isGroupChat ? {
    headerTitle: 'Chat info',
    chatId,
    chatName,
  } : {
    headerTitle,
    userId,
    chatName,
    chatAvatarUrl,
  };
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={openInfoScreen(routeName, navigation, screenParams)}
    >
      <Avatar size={30} url={chatAvatarUrl} username={chatName} />
    </TouchableOpacity>
  );
};

export default ChatScreenHeaderButton;
