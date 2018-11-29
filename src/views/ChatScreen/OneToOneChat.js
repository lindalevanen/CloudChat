import React from 'react';
import { View, Text } from 'react-native';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withFirebase } from 'react-redux-firebase';

import ChatScreen from './index';
import { createChatRoom } from '../../store/utils/firebase';

class OneToOneChatScreen extends React.Component {
  state = {
    isDraft: true,
  }

  createChat = async () => {
    const { firebase, navigation, profileUid } = this.props;
    const { userId } = navigation.state.params;
    console.log('creating chat with person ', userId);
    const res = await createChatRoom(firebase, false, [profileUid, userId]);
    const chatId = res.path.pieces_[1];
    navigation.setParams({ chatId });
    this.setState({ isDraft: false });
    return chatId;
  };

  render() {
    const { navigation } = this.props;
    const { isDraft } = this.state;
    return (
      <ChatScreen
        navigation={navigation}
        isDraft={isDraft}
        oneToOneContact={navigation.state.params.userId}
        createChatFromDraft={this.createChat}
      />
    );
  }
}

const enhance = compose(
  connect(state => ({ profileUid: state.firebase.auth.uid })),
  withFirebase,
);

export default enhance(OneToOneChatScreen);
