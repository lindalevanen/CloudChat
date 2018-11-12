import React from 'react';
import { format } from 'date-fns';
import { Text, View, StyleSheet } from 'react-native';

import Avatar from '../Avatar';

const prettyTimestamp = unix => format(new Date(unix), 'HH:mm');

const styles = StyleSheet.create({
  section: {
    backgroundColor: 'white',
    borderColor: 'darkgrey',
    borderBottomWidth: 0.3,
  },
  chatContainer: {
    padding: 10,
    paddingLeft: 50,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  summaryContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 5,
  },
  chatTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatUpdatedText: {
    fontSize: 12,
  },
  dark: {
    backgroundColor: '#191B2C',
    borderColor: '#0E0E19',
  },
  darkText: {
    color: '#FAFAFA',
  },
});

const ChatPreview = ({ chat, useDarkTheme }) => (
  <View style={[styles.chatPreview]}>
    <View style={[styles.chatContainer, styles.section, useDarkTheme && styles.dark]}>
      <Avatar url={chat.avatarUrl} />
      <View style={[styles.summaryContainer]}>
        <Text
          style={[
            styles.chatTitleText,
            useDarkTheme && styles.darkText,
          ]}
        >
          {(chat && chat.title) ? chat.title : '-'}
        </Text>
        <Text
          style={[
            styles.chatUpdatedText,
            useDarkTheme && styles.darkText,
          ]}
        >
          {prettyTimestamp(chat.timeModified)}
        </Text>
      </View>
      <Text
        style={[
          styles.chatUpdatedText,
          useDarkTheme && styles.darkText,
        ]}
      >
        {chat.lastMessage}
      </Text>
    </View>
  </View>
);

export default ChatPreview;
