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

const SwipeableChatPreview = ({ id, chat, onPress }) => (
  <Swipeable rightButtons={rightButtons} rightActionActivationDistance={20}>
    <ChatPreview chat={{ id, ...chat }} onPress={onPress} />
  </Swipeable>
);

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
      <SwipeableChatPreview
        key={key}
        id={key}
        chat={chat}
        onPress={createOpenChatCallback(navigation)}
      />
    ))}
  </View>
);

export default withNavigation(ChatList);
