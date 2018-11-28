import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { AvatarWithProfileLink } from '../../components/Avatar';
import { withTheme } from '../../components/ThemedWrapper';

const styles = theme => ({
  container: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  messageBubble: {
    marginLeft: 10,
    padding: 8,
    paddingHorizontal: 14,
    backgroundColor: theme.messageBubble,
    borderRadius: 14,
    borderTopLeftRadius: 0,
  },
  sender: {
    color: theme.messageSender,
  },
  messageBody: {
    color: theme.messageBody,
    fontSize: 16,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  ownBubble: {
    marginLeft: 0,
    marginRight: 10,
    borderTopLeftRadius: 14,
    borderBottomRightRadius: 0,
    backgroundColor: theme.ownMessageBubble,
  },
});

const Message = ({
  theme, sender, message, profileUid,
}) => {
  const style = styles(theme);
  const ownMessage = profileUid === sender.id;
  return (
    <View style={[style.container, ownMessage && style.ownMessage]}>
      <AvatarWithProfileLink
        size={44}
        url={sender.avatarUrl}
        username={sender.username}
        userId={sender.id}
      />
      <View style={[style.messageBubble, ownMessage && style.ownBubble]}>
        <Text style={style.sender}>{sender.username}</Text>
        <Text style={style.messageBody}>
          {message.originalMessage || message.body}
        </Text>
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  profile: state.firebase.profile,
  profileUid: state.firebase.auth.uid,
});

const enhance = compose(
  connect(mapStateToProps),
  withTheme,
);

export default enhance(Message);
