import React from 'react';
import { format } from 'date-fns';
import { TouchableHighlight, Text, View } from 'react-native';

import Avatar from '../Avatar';
import { withTheme } from '../ThemedWrapper';

const prettyTimestamp = unix => format(new Date(unix), 'HH:mm');

const styles = theme => ({
  chatPreview: {
    backgroundColor: theme.foreground,
    borderColor: theme.separator,
    borderBottomWidth: 0.3,
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
    color: theme.text1,
  },
  chatUpdatedText: {
    fontSize: 12,
    color: theme.text1,
  },
});

const ChatPreview = ({ chat, theme, onPress }) => {
  const style = styles(theme);
  const openChat = () => onPress(chat.id, chat.title, chat.avatarUrl);
  return (
    <TouchableHighlight
      style={[style.chatPreview]}
      onPress={openChat}
      underlayColor={theme.backdrop}
    >
      <View style={[style.chatContainer]}>
        <Avatar url={chat.avatarUrl} username={chat.title} />
        <View style={[style.summaryContainer]}>
          <Text style={[style.chatTitleText]}>
            {chat && chat.title ? chat.title : '-'}
          </Text>
          <Text style={[style.chatUpdatedText]}>
            {prettyTimestamp(chat.timeModified)}
          </Text>
        </View>
        <Text style={[style.chatUpdatedText]}>{chat.lastMessage}</Text>
      </View>
    </TouchableHighlight>
  );
};

export default withTheme(ChatPreview);
