import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Circle';

import { AvatarWithProfileLink } from '../../components/Avatar';
import { withTheme } from '../../components/ThemedWrapper';
import OpenImageWrapper from '../../components/OpenImageWrapper';
import UrlPreview from '../../components/UrlPreview';

const styles = theme => ({
  container: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  messageBubble: {
    marginLeft: 10,
    padding: 6,
    paddingHorizontal: 8,
    backgroundColor: theme.messageBubble,
    borderRadius: 8,
    borderTopLeftRadius: 2,
    maxWidth: 240,
  },
  sender: {
    color: theme.messageSender,
  },
  senderTextWithImage: {
    padding: 8,
    paddingVertical: 5,
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
  chatImageWrapper: {
    marginLeft: 10,
    backgroundColor: theme.messageBubble,
    borderRadius: 8,
    borderTopLeftRadius: 2,
    overflow: 'hidden',
  },
});

const Message = ({
  theme, sender, message, profileUid,
}) => {
  const style = styles(theme);
  const ownMessage = profileUid === sender.id;
  const { body, attachment, dimensions, previewDataOfURL } = message.payload;

  const winDimensions = Dimensions.get('window');
  const maxWidth = winDimensions.width / 3 * 2;
  const maxHeight = 200;

  let width = 0;
  let height = 0;
  if (dimensions) {
    const w = dimensions.width;
    const h = dimensions.height;
    if (w > h) {
      width = maxWidth;
      height = h / w * maxWidth;
    } else {
      height = maxHeight;
      width = w / h * maxHeight;
    }
  }

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
        <View
          style={[
            style.chatImageWrapper,
            ownMessage && style.ownBubble,
          ]}
        >
          {!ownMessage && (
            <Text style={[style.sender, style.senderTextWithImage]}>{sender.username}</Text>
          )}
          <OpenImageWrapper
            imageUrl={attachment}
          >
            <Image
              style={{ height, width }}
              source={{ uri: attachment }}
              indicator={ProgressBar}
              indicatorProps={{
                color: 'white',
              }}
            />
          </OpenImageWrapper>
        </View>)
        : previewDataOfURL ? (
          <View
            style={[style.messageBubble, ownMessage && style.ownBubble]}
          >
            {!ownMessage && (<Text style={style.sender}>{sender.username}</Text>)}
            <Text style={[style.messageBody]}>{body}</Text>
            <UrlPreview
              description={previewDataOfURL.description}
              image={previewDataOfURL.image}
              title={previewDataOfURL.title}
              url={previewDataOfURL.url}
            />
          </View>) : (
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
