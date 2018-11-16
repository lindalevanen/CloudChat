import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
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

const ChatScreenHeaderButton = ({ navigation }) => {
  const { chatName, chatId, chatAvatarUrl } = navigation.state.params;
  return (
    <TouchableOpacity style={styles.container}>
      <Avatar size={30} url={chatAvatarUrl} username={chatName} />
    </TouchableOpacity>
  );
};

export default ChatScreenHeaderButton;
