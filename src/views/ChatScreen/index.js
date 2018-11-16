import React from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { firebaseConnect, populate } from 'react-redux-firebase';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';

const ChatScreen = ({
  chat,
  messageString,
  setMessageString,
  firebase,
  navigation,
}) => (
  <View>

    <TextInput
      placeholder="Message"
      onChangeText={setMessageString}
      autoCorrect={false}
      autoCapitalize="none"
      value={messageString}
    />
    <Button title="Send" onPress={() => sendMessage(firebase, messageString, navigation.state.params.chatId)} />
  </View>
);

const sendMessage = async (firebaseRef, messageString, chatId) => {
  const messageData = {
    body: messageString,
    createdAt: Date.now(),
    attachment: '',
  };
  const res = firebaseRef.push(`chats/${chatId}/messages`, messageData);
  console.log(res);
};

const populates = [
  { child: 'members', root: 'users' },
];

const mapStateToProps = ({ firebase }, { navigation }) => ({
  chat: populate(firebase, `chats/${navigation.state.params.chatId}`, populates),
});

const enhance = compose(
  withState('messageString', 'setMessageString', ''),
  firebaseConnect(({ navigation }) => [
    { path: `chats/${navigation.state.params.chatId}`, populates },
  ]),
  connect(mapStateToProps),
);

export default enhance(ChatScreen);
