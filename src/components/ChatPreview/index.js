import React from 'react';
import { format } from 'date-fns';
import { TouchableHighlight, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';

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

const ChatPreview = ({
  chat, profileUid, theme, onPress,
}) => {
  const style = styles(theme);

  let contact;
  if (!chat.groupChat && chat.members) {
    contact = Object.values(chat.members).find(user => user.id !== profileUid);
  }
  const chatTitle = chat.groupChat
    ? chat.title || 'Untitled groupchat'
    : contact.username;
  const avatarUrl = chat.groupChat ? chat.avatarUrl : contact.avatarUrl;

  const openChat = () => {
    if (chat.groupChat) {
      onPress(chat.id, chatTitle, avatarUrl, true);
    } else {
      onPress(
        chat.id,
        chatTitle,
        avatarUrl,
        false,
        contact.id,
        contact.username,
        contact.avatarUrl,
      );
    }
  };

  if (chat === undefined) return null;
  return (
    <TouchableHighlight
      style={[style.chatPreview]}
      onPress={openChat}
      underlayColor={theme.backdrop}
    >
      <View style={[style.chatContainer]}>
        <Avatar url={avatarUrl} username={chat.title} />
        <View style={[style.summaryContainer]}>
          <Text style={[style.chatTitleText]}>{chatTitle}</Text>
          <Text style={[style.chatUpdatedText]}>
            {prettyTimestamp(chat.createdAt)}
          </Text>
        </View>
        <Text style={[style.chatUpdatedText]}>{chat.lastMessage}</Text>
      </View>
    </TouchableHighlight>
  );
};

const mapStateToProps = ({ firebase }) => ({
  profileUid: firebase.auth.uid,
});

const enhance = compose(
  withTheme,
  connect(mapStateToProps),
);

export default enhance(ChatPreview);
