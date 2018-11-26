import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { firebaseConnect, populate } from 'react-redux-firebase';
import TextInput from '../../components/TextInput';
import Button from '../../components/Button';
import { sendMessage } from '../../store/utils/firebase';

let scrollView;
class ChatScreen extends React.Component {
  componentDidUpdate(props) {
    if (props.chat.messages.length !== this.props.chat.messages.length) {
      scrollView.scrollToEnd();
    }
  }

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
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }} ref={(ref) => { scrollView = ref; }}>
          <Text>{JSON.stringify(chat.messages, '', 2)}</Text>
        </ScrollView>
        <TextInput
          placeholder="Message"
          onChangeText={setMessageString}
          autoCorrect={false}
          autoCapitalize="none"
          value={messageString}
        />
        <Button title="Send" onPress={this.sendAndClearMessage} />
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
