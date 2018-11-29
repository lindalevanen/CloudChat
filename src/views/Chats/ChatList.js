import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import _map from 'lodash/map';
import { withNavigation, StackActions } from 'react-navigation';
import Swipeable from 'react-native-swipeable';
import { Ionicons } from '@expo/vector-icons';

import ChatPreview from '../../components/ChatPreview';

const SwipeActionButton = ({ color, iconName, onPress }) => (
  <TouchableOpacity
    style={{
      backgroundColor: color,
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 26,
    }}
    onPress={onPress}
  >
    <Ionicons name={iconName} color="white" size={34} />
  </TouchableOpacity>
);

const rightButtons = [
  <SwipeActionButton color="indigo" iconName="md-notifications-off" />,
  <SwipeActionButton color="tomato" iconName="md-trash" />,
];

const SwipeableChatPreview = ({ chat, onPress }) => (
  <Swipeable rightButtons={rightButtons} rightActionActivationDistance={20}>
    <ChatPreview chat={chat} onPress={onPress} />
  </Swipeable>
);

const createOpenChatCallback = navigation => (
  chat, contact,
) => {
  if (chat.groupChat) {
    navigation.dispatch(
      StackActions.push({
        routeName: 'ChatScreen',
        params: {
          headerTitle: chat.title,
          chatId: chat.id,
          chatName: chat.title,
          chatAvatarUrl: chat.avatarUrl,
          isGroupChat: true,
        },
      }),
    );
  } else if (contact) {
    navigation.dispatch(
      StackActions.push({
        routeName: 'ChatScreen',
        params: {
          headerTitle: contact.username,
          chatId: chat.id,
          userId: contact.id,
          chatName: contact.username,
          chatAvatarUrl: contact.avatarUrl,
          isGroupChat: false,
        },
      }),
    );
  }
};

const ChatList = ({ chats, navigation }) => (
  <View>
    {chats.map(chat => (
      <SwipeableChatPreview
        key={chat.id}
        chat={chat}
        onPress={createOpenChatCallback(navigation)}
      />
    ))}
  </View>
);

export default withNavigation(ChatList);
