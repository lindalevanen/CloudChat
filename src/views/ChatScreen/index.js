import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { firebaseConnect, populate } from 'react-redux-firebase';

const ChatScreen = ({
  chat,
  chatMembers,
}) => (
  <View>
    <Text>{JSON.stringify(chat, '', 2)}</Text>
  </View>
);

const populates = [
  { child: 'members', root: 'users' },
];

const mapStateToProps = ({ firebase }, { navigation }) => ({
  chat: populate(firebase, `chats/${navigation.state.params.chatId}`, populates),
});

const enhance = compose(
  firebaseConnect(({ navigation }) => [
    { path: `chats/${navigation.state.params.chatId}`, populates },
  ]),
  connect(mapStateToProps),
);

export default enhance(ChatScreen);
