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
  chatId,
  chatName,
  chatAvatarUrl,
  isGroupChat,
  userId,
  userName,
  avatarUrl,
) => {
  navigation.dispatch(
    StackActions.push({
      routeName: 'ChatScreen',
      params: {
        headerTitle: chatName,
        chatId,
        chatName,
        chatAvatarUrl,
        isGroupChat,
        userId,
        userName,
        avatarUrl,
      },
    }),
  );
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
