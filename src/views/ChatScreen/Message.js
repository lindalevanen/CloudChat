import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Circle';

import { AvatarWithProfileLink } from '../../components/Avatar';
import { withTheme } from '../../components/ThemedWrapper';
import OpenImageWrapper from '../../components/OpenImageWrapper';
import UrlPreview from '../../components/UrlPreview';
import ImageWithQuality from '../../components/ImageWithQuality';
import TextWithTranslation from './TextWithTranslation';

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

const formatDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();
  const hours = date.getHours();
  const mins = date.getMinutes();

  return day + '/' + (month + 1) + '/' + year + ' ' + hours + ':' + mins;
};

const Message = ({
  theme, sender, message, profileUid, imageSource, setImageSource,
}) => {
  const style = styles(theme);
  const ownMessage = profileUid === sender.id;
  const { timestamp } = message
  const {
    body, attachment, dimensions, previewDataOfURL,
  } = message.payload;

  const hasFancyImage = typeof attachment === 'object';

  const winDimensions = Dimensions.get('window');
  const maxWidth = (winDimensions.width / 3) * 2;
  const maxHeight = 200;

  let width = 0;
  let height = 0;
  if (dimensions) {
    const w = dimensions.width;
    const h = dimensions.height;
    if (w > h) {
      width = maxWidth;
      height = (h / w) * maxWidth;
    } else {
      height = maxHeight;
      width = (w / h) * maxHeight;
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
        <View style={[style.chatImageWrapper, ownMessage && style.ownBubble]}>
          {!ownMessage && (
            <Text style={[style.sender, style.senderTextWithImage]}>
              {sender.username}
            </Text>
          )}
          <OpenImageWrapper
            imageData={[{
              url: imageSource,
              sender: sender.username,
              time: formatDate(new Date(timestamp)),
            }]}
          >
            {hasFancyImage ? (
              <ImageWithQuality
                style={{ height, width }}
                attachment={attachment}
                setImageSource={src => setImageSource(src)}
              />
            ) : (
              <Image
                style={{ height, width }}
                source={{ uri: attachment }}
                indicator={ProgressBar}
                indicatorProps={{
                  color: 'white',
                }}
              />
            )}
          </OpenImageWrapper>
        </View>
      ) : previewDataOfURL ? (
        <View style={[style.messageBubble, ownMessage && style.ownBubble]}>
          {!ownMessage && <Text style={style.sender}>{sender.username}</Text>}
          <TextWithTranslation theme={theme} style={[style.messageBody]} payload={message.payload} />
          <UrlPreview
            description={previewDataOfURL.description}
            image={previewDataOfURL.image}
            title={previewDataOfURL.title}
            url={previewDataOfURL.url}
          />
        </View>
      ) : (
        <View style={[style.messageBubble, ownMessage && style.ownBubble]}>
          {!ownMessage && <Text style={style.sender}>{sender.username}</Text>}
          <TextWithTranslation theme={theme} style={[style.messageBody]} payload={message.payload} />
        </View>
      )}
    </View>
  );
};

const mapStateToProps = state => ({
  profile: state.firebase.profile,
  profileUid: state.firebase.auth.uid,
});

const enhance = compose(
  withState('imageSource', 'setImageSource', ''),
  connect(mapStateToProps),
  withTheme,
);

export default enhance(Message);
