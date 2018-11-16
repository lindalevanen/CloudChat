import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { firebaseConnect, populate } from 'react-redux-firebase';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';


const sendMessage = (firebaseRef, messageString, chatId, userId) => {
  if (messageString === '') {
    return Promise.reject(new Error('Empty message not sent'));
  }
  if (!chatId || !userId) {
    return Promise.reject(new Error('chatId or userId missing'));
  }
  const messageData = {
    body: messageString,
    createdAt: Date.now(),
    sender: userId,
    attachment: '',
  };
  return firebaseRef.push(`chats/${chatId}/messages`, messageData);
};

const ChatScreen = ({
  messageString,
  setMessageString,
  firebase,
  navigation,
  profileUid,
}) => {
  const sendAndClearMessage = async () => {
    const messageBody = messageString;
    setMessageString('');
    await sendMessage(firebase, messageBody, navigation.state.params.chatId, profileUid);
  };
  return (
    <View>
      <Text>{JSON.stringify(profileUid, '', 2)}</Text>
      <TextInput
        placeholder="Message"
        onChangeText={setMessageString}
        autoCorrect={false}
        autoCapitalize="none"
        value={messageString}
      />
      <Button title="Send" onPress={sendAndClearMessage} />
    </View>
  );
};

const populates = [
  { child: 'members', root: 'users' },
];

const mapStateToProps = ({ firebase }, { navigation }) => ({
  chat: populate(firebase, `chats/${navigation.state.params.chatId}`, populates),
  profileUid: firebase.auth.uid,
});

const enhance = compose(
  withState('messageString', 'setMessageString', ''),
  firebaseConnect(({ navigation }) => [
    { path: `chats/${navigation.state.params.chatId}`, populates },
  ]),
  connect(mapStateToProps),
);

export default enhance(ChatScreen);
