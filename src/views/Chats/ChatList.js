import React from 'react';
import { Text, View } from 'react-native';

import ChatPreview from '../../components/ChatPreview';

const ChatList = ({
  chats,
  useDarkTheme,
}) => {
  console.log(`useDarkTheme: ${useDarkTheme}`);
  if (chats) {
    console.log(`chats ${JSON.stringify(chats)}`);
    const chatList = Object.values(Object.values(chats));
    console.log(`chatList ${JSON.stringify(chatList, null, 2)}`);
    const namedChats = Object.keys(chatList).map(key => ({ id: key, chat: chats[key] }));
    console.log(`namedChats ${JSON.stringify(namedChats, null, 2)}`);
    return (
      <View>
        { namedChats
          ? namedChats.map(chat => <ChatPreview key={chat.id} chat={chat.chat} useDarkTheme={useDarkTheme} />)
          : <Text>Loading chats...</Text>
        }
      </View>
    );
  }
  return <Text>Loading...</Text>;
};

export default ChatList;
