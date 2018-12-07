import React from 'react';
import { format } from 'date-fns';
import { TouchableHighlight, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { compose, setDisplayName } from 'recompose';
import _find from 'lodash/find';
import _get from 'lodash/get';

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
    alignItems: 'center',
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
  chatPreviewText: {
    marginTop: 4,
    color: theme.text2,
  },
});

function getLastEvent(chat, profileUid) {
  if (
    !chat.lastEvent
    || !chat.lastEvent.type
    || !chat.lastEvent.payload
    || !chat.lastEvent.timestamp
  ) {
    return null;
  }
  const { sender: senderId, body } = _get(chat, 'lastEvent.payload', {});
  let sender = _find(chat.members, user => user.id === senderId);
  const { timestamp } = chat.lastEvent;
  if (!sender) {
    return null;
  }
  if (sender.id === profileUid) {
    sender = {
      username: 'You',
    };
  }

  switch (chat.lastEvent.type) {
    case 'message':
      return {
        body: `${body.length > 30 ? `${body.slice(0, 30)}...` : body}`,
        sender,
        timestamp,
      };
    case 'image':
      return {
        body: 'Photo',
        sender,
        timestamp,
      };
    default:
      return null;
  }
}

const ChatPreview = ({
  theme, onPress, chat, profileUid,
}) => {
  const style = styles(theme);
  let imageUrl;
  let chatTitle;
  let timestampToUse;
  let lastEventText;

  let contact;

  if (chat.groupChat) {
    imageUrl = chat.avatarUrl;
    chatTitle = chat.title;
    timestampToUse = chat.createdAt; // should have preview message here
    const lastEvent = getLastEvent(chat, profileUid);
    lastEventText = lastEvent
      ? `${lastEvent.sender.username}: ${lastEvent.body}`
      : null;
    if (lastEvent && lastEvent.timestamp) {
      timestampToUse = lastEvent.timestamp;
    }
  } else {
    contact = _find(chat.members, user => user.id !== profileUid);
    if (contact) {
      imageUrl = contact.avatarUrl;
      chatTitle = contact.username;
      timestampToUse = chat.createdAt;
      const lastEvent = getLastEvent(chat, profileUid);
      if (lastEvent && lastEvent.timestamp) {
        timestampToUse = lastEvent.timestamp;
      }
      lastEventText = lastEvent
        ? lastEvent.sender.username !== 'You'
          ? lastEvent.body
          : `${lastEvent.sender.username}: ${lastEvent.body}`
        : null;
    }
  }

  const onPressHandler = () => (chat.groupChat ? onPress(chat) : onPress(chat, contact));

  return (
    <TouchableHighlight
      style={[style.chatPreview]}
      onPress={onPressHandler}
      underlayColor={theme.backdrop}
    >
      <View style={[style.chatContainer]}>
        <Avatar url={imageUrl} username={chatTitle} />
        <View style={[style.summaryContainer]}>
          <View>
            <Text style={[style.chatTitleText]}>{chatTitle}</Text>
            {lastEventText ? (
              <Text style={style.chatPreviewText}>{lastEventText}</Text>
            ) : null}
          </View>
          <Text style={[style.chatUpdatedText]}>
            {prettyTimestamp(timestampToUse)}
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
  setDisplayName('ChatPreview'),
  connect(mapStateToProps),
);

export default enhance(ChatPreview);
