import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { firebaseConnect, populate } from 'react-redux-firebase';
import _get from 'lodash/get';
import _map from 'lodash/map';

import MessageList from './MessageList';
import MessageInput from './MessageInput';

import { sendMessage } from '../../store/utils/firebase';

class ChatScreen extends React.Component {
  sendAndClearMessage = async () => {
    const {
      setMessageString,
      messageString,
      firebase,
      navigation,
      profileUid,
    } = this.props;
    const messageBody = messageString;
    setMessageString('');
    await sendMessage(
      firebase,
      messageBody,
      navigation.state.params.chatId,
      profileUid,
    );
  };

  render() {
    const { chat, messageString, setMessageString } = this.props;
    const messageList = _map(_get(chat, 'messages', {}), (message, id) => ({ id, ...message }));
    return (
      <View style={{ flex: 1 }}>
        <MessageList chat={chat} messageList={messageList} />
        <MessageInput
          messageString={messageString}
          setMessageString={setMessageString}
          sendMessage={this.sendAndClearMessage}
        />
      </View>
    );
  }
}

const populates = [{ child: 'members', root: 'users' }];

const mapStateToProps = ({ firebase }, { navigation }) => ({
  chat: populate(
    firebase,
    `chats/${navigation.state.params.chatId}`,
    populates,
  ),
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
