import React from 'react';
import { Text, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { firebaseConnect, populate } from 'react-redux-firebase';
import _map from 'lodash/map';

import { withTheme } from '../../components/ThemedWrapper';
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
      isDraft,
      oneToOneContact,
      createChatFromDraft,
    } = this.props;

    let { chatId } = navigation.state.params;

    if (isDraft && oneToOneContact) {
      console.log(`unitialised chat with person ${oneToOneContact}`);
      chatId = await createChatFromDraft();
    }

    const messageBody = messageString;
    setMessageString('');
    await sendMessage(
      firebase,
      messageBody,
      chatId,
      profileUid,
    );
  };

  render() {
    const {
      theme,
      chatMetadata,
      chatEvents,
      messageString,
      setMessageString,
    } = this.props;
    const messageList = _map(chatEvents, (message, id) => ({
      id,
      ...message,
    }));
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.foreground }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding"
          keyboardVerticalOffset={90}
        >
          <MessageList chatMetadata={chatMetadata} messageList={messageList} />
          <MessageInput
            messageString={messageString}
            setMessageString={setMessageString}
            sendMessage={this.sendAndClearMessage}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const populates = [{ child: 'members', root: 'users', populateByKey: true }];

const mapStateToProps = ({ firebase }, { navigation, isDraft }) => ({
  chatMetadata:
    (isDraft && {})
    || populate(
      firebase,
      `chatMetadata/${navigation.state.params.chatId}`,
      populates,
    ),
  chatEvents:
    (isDraft && {})
    || populate(firebase, `chatEvents/${navigation.state.params.chatId}`),
  profileUid: firebase.auth.uid,
});

const enhance = compose(
  withTheme,
  withState('messageString', 'setMessageString', ''),
  firebaseConnect(({ navigation, isDraft }) => (isDraft
    ? []
    : [
      { path: `chatMetadata/${navigation.state.params.chatId}`, populates },
      { path: `chatEvents/${navigation.state.params.chatId}` },
    ])),
  connect(mapStateToProps),
);

export default enhance(ChatScreen);
