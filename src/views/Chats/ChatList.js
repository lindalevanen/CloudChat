import React from 'react';
import { View } from 'react-native';
import _map from 'lodash/map';
import { withNavigation, StackActions } from 'react-navigation';

import ChatPreview from '../../components/ChatPreview';

const createOpenChatCallback = navigation => (
  chatId,
  chatName,
  chatAvatarUrl,
) => navigation.dispatch(
  StackActions.push({
    routeName: 'ChatScreen',
    params: {
      headerTitle: chatName,
      chatId,
      chatName, // to pass these to the header component
      chatAvatarUrl,
    },
  }),
);

const ChatList = ({ chats, navigation }) => (
  <View>
    {_map(chats, (chat, key) => (
      key !== 'exists'
      && (
      <ChatPreview
        key={key}
        chat={{ id: key, ...chat }}
        onPress={createOpenChatCallback(navigation)}
      />
      )
    ))}
  </View>
);

export default withNavigation(ChatList);
