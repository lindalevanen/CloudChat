import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { withNavigation, StackActions } from 'react-navigation';
import Swipeable from 'react-native-swipeable';
import { Ionicons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { withFirebase } from 'react-redux-firebase';
import { leaveChat } from '../../store/utils/firebase';
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

const LeaveChatButton = ({ firebase, chatId, profileUid }) => (
  <SwipeActionButton
    color="tomato"
    iconName="md-trash"
    onPress={() => leaveChat(firebase, chatId, profileUid)}
  />
);

const SwipeableChatPreview = ({
  firebase, chat, profileUid, onPress,
}) => (
  <Swipeable
    rightButtons={[
      <LeaveChatButton
        chatId={chat.id}
        profileUid={profileUid}
        firebase={firebase}
      />,
    ]}
    rightActionActivationDistance={20}
  >
    <ChatPreview chat={chat} onPress={onPress} />
  </Swipeable>
);

const createOpenChatCallback = navigation => (chat, contact) => {
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

const ChatList = ({
  firebase, chats, navigation, profileUid,
}) => (
  <View>
    {chats.map(chat => (
      <SwipeableChatPreview
        key={chat.id}
        firebase={firebase}
        profileUid={profileUid}
        chat={chat}
        onPress={createOpenChatCallback(navigation)}
      />
    ))}
  </View>
);

const enhance = compose(
  withFirebase,
  connect(({ firebase }) => ({ profileUid: firebase.auth.uid })),
  withNavigation,
);

export default enhance(ChatList);
