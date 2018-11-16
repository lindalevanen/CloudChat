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

const openChatInfoScreen = (navigation, chatId, chatName) => () => navigation.dispatch(
  StackActions.push({
    routeName: 'ChatInfoScreen',
    params: {
      chatId,
      chatName, // for header to show
    },
  }),
);

const ChatScreenHeaderButton = ({ navigation }) => {
  const { chatName, chatId, chatAvatarUrl } = navigation.state.params;
  return (
    <TouchableOpacity style={styles.container} onPress={openChatInfoScreen(navigation, chatId, chatName)}>
      <Avatar size={30} url={chatAvatarUrl} username={chatName} />
    </TouchableOpacity>
  );
};

export default ChatScreenHeaderButton;
