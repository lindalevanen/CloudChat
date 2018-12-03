import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Circle';

import { AvatarWithProfileLink } from '../../components/Avatar';
import { withTheme } from '../../components/ThemedWrapper';

const styles = theme => ({
  container: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  messageBubble: {
    marginLeft: 10,
    padding: 8,
    paddingHorizontal: 14,
    backgroundColor: theme.messageBubble,
    borderRadius: 14,
    borderTopLeftRadius: 2,
    maxWidth: 240,
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
    borderBottomRightRadius: 2,
    backgroundColor: theme.ownMessageBubble,
  },
  chatImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
    borderRadius: 10,
  },
});

const Message = ({
  theme, sender, message, profileUid,
}) => {
  const style = styles(theme);
  const ownMessage = profileUid === sender.id;
  const { body, attachment } = message.payload;

  const dimensions = Dimensions.get('window');
  const maxWidth = dimensions.width / 3 * 2;
  const maxHeight = 200;

  return (
    <View style={[style.container, ownMessage && style.ownMessage]}>
      {!ownMessage && (
      <AvatarWithProfileLink
        size={44}
        url={sender.avatarUrl}
        username={sender.username}
        userId={sender.id}
      />
      )}
      {attachment ? (
        <Image
          style={{ height: maxHeight, width: maxWidth }}
          imageStyle={style.chatImage}
          source={{ uri: attachment }}
          indicator={ProgressBar}
        />) : (
          <View style={[style.messageBubble, ownMessage && style.ownBubble]}>
            {!ownMessage && (<Text style={style.sender}>{sender.username}</Text>)}
            <Text style={style.messageBody}>{body}</Text>
          </View>)
      }
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
