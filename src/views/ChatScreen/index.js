import React from 'react';
import { KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import { firebaseConnect, populate } from 'react-redux-firebase';
import _map from 'lodash/map';
import { ImagePicker } from 'expo';

import { withTheme } from '../../components/ThemedWrapper';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ImageSelector from '../../components/ImageSelector';

import { sendMessage, uploadChatImage, setDownloadUrl } from '../../store/utils/firebase';

const imageOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  exif: false,
};

class ChatScreen extends React.Component {
  sendAndClearMessage = async () => {
    const {
      setMessageString,
      messageString,
      firebase,
      profileUid,
    } = this.props;
    const chatId = await this.getChatId();

    const messageBody = messageString;
    setMessageString('');
    await sendMessage(firebase, messageBody, chatId, profileUid);
  };

  handlePhoto = async (data) => {
    const {
      firebase,
      profileUid,
      imageQuality,
      setLoading,
    } = this.props;
    const chatId = await this.getChatId();

    const snapshot = await sendMessage(firebase, '', chatId, profileUid, 'placeholder', data);
    const messageId = snapshot.path.pieces_[2];
    const {
      uploadTaskSnapshot: { ref }, key,
    } = await uploadChatImage(firebase, data, chatId, profileUid, imageQuality);
    const downloadUrl = await ref.getDownloadURL();
    await setDownloadUrl(firebase, chatId, messageId, downloadUrl, key);
    setLoading(false);
  }

  getChatId = async () => {
    const {
      navigation,
      isDraft,
      oneToOneContact,
      createChatFromDraft,
    } = this.props;
    let { chatId } = navigation.state.params;

    if (isDraft && oneToOneContact) {
      chatId = await createChatFromDraft();
    }
    return chatId;
  }

  render() {
    const {
      theme,
      chatMetadata,
      chatEvents,
      messageString,
      setMessageString,
      loading,
      setLoading,
      error,
      setError,
      fileModalOpen,
      setFileModalOpen,
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
          <MessageList
            chatMetadata={chatMetadata}
            messageList={messageList}
          />
          <MessageInput
            messageString={messageString}
            setMessageString={setMessageString}
            sendMessage={this.sendAndClearMessage}
            chooseFile={() => setFileModalOpen(!fileModalOpen)}
          />
          {fileModalOpen && (
            <ImageSelector
              setLoading={setLoading}
              setError={setError}
              onFileReceived={this.handlePhoto}
              imageOptions={imageOptions}
              buttonStyle={{ width: '50%' }}
            />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const populates = [{ child: 'members', root: 'users', populateByKey: true }];

const mapStateToProps = ({ firebase, settings }, { navigation, isDraft }) => ({
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
  imageQuality: settings.imageQuality,
});

const enhance = compose(
  withTheme,
  withState('messageString', 'setMessageString', ''),
  withState('fileModalOpen', 'setFileModalOpen', false),
  withState('loading', 'setLoading', false),
  withState('error', 'setError', null),
  firebaseConnect(({ navigation, isDraft }) => (isDraft
    ? []
    : [
      { path: `chatMetadata/${navigation.state.params.chatId}`, populates },
      { path: `chatEvents/${navigation.state.params.chatId}` },
    ])),
  connect(mapStateToProps),
);

export default enhance(ChatScreen);
