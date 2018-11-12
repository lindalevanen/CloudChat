import React from 'react';
import { View } from 'react-native';
import _map from 'lodash/map';

import ChatPreview from '../../components/ChatPreview';

const ChatList = ({
  chats,
}) => (
  <View>
    { _map(chats, (chat, key) => <ChatPreview key={key} chat={chat} />) }
  </View>
);

export default ChatList;
