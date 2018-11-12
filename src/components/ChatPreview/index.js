import React from 'react';
import { format } from 'date-fns';
import { Text, View, StyleSheet } from 'react-native';

import Avatar from '../Avatar';
import { withTheme } from '../ThemedWrapper';

const prettyTimestamp = unix => format(new Date(unix), 'HH:mm');

const styles = StyleSheet.create({
  chatPreview: {
    backgroundColor: 'white',
    borderColor: 'darkgrey',
    borderBottomWidth: 0.3,
  },
  darkChatPreview: {
    backgroundColor: '#191B2C',
    borderColor: '#0E0E19',
  },
  chatContainer: {
    padding: 10,
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginLeft: 10,
  },
  chatTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatUpdatedText: {
    fontSize: 12,
  },
  darkText: {
    color: '#FAFAFA',
  },
});

const ChatPreview = ({ chat, useDarkTheme }) => (
  <View style={[styles.chatPreview, useDarkTheme && styles.darkChatPreview]}>
    <View style={[styles.chatContainer]}>
      <Avatar url={chat.avatarUrl} />
      <View style={[styles.summaryContainer]}>
        <Text style={[styles.chatTitleText, useDarkTheme && styles.darkText]}>
          {chat && chat.title ? chat.title : '-'}
        </Text>
        <Text style={[styles.chatUpdatedText, useDarkTheme && styles.darkText]}>
          {prettyTimestamp(chat.timeModified)}
        </Text>
      </View>
      <Text style={[styles.chatUpdatedText, useDarkTheme && styles.darkText]}>
        {chat.lastMessage}
      </Text>
    </View>
  </View>
);

export default withTheme(ChatPreview);
