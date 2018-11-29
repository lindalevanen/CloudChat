import React from 'react';
import {
  View, ScrollView, ActivityIndicator,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  isLoaded,
  firebaseConnect,
} from 'react-redux-firebase';
import _map from 'lodash/map';

import { withTheme } from '../../components/ThemedWrapper';
import EmptyPlaceholder from '../../components/EmptyPlaceholder';
import ChatList from './ChatList';

const styles = theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.backdrop,
  },
  list: {
    flex: 1,
  },
});

const LoadingView = () => (
  <View style={{ flex: 1, justifyContent: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

const chatsWithUsers = (chats, users) => _map(chats, (chat, id) => {
  const chatMembers = _map(chat.members, user => ({
    ...user,
    ...users[user.id],
  }));
  return {
    ...chat,
    id,
    members: chatMembers,
  };
});

const Chats = ({ theme, chats, users }) => {
  const style = styles(theme);
  const { exists, ...chatMap } = chats || {};
  const isEmpty = exists && Object.keys(chatMap).length === 0;
  return (
    <View style={style.container}>
      {!isLoaded(chats) ? (
        <LoadingView />
      ) : isEmpty ? (
        <EmptyPlaceholder text="No chats yet, start messaging!" />
      ) : (
        <ScrollView style={[style.list]}>
          <ChatList chats={chatsWithUsers(chatMap, users)} />
        </ScrollView>
      )}
    </View>
  );
};

const mapStateToProps = ({ firebase }) => ({
  chats: firebase.profile.chats,
  users: firebase.data.users,
  profileUid: firebase.auth.uid,
});

const enhance = compose(
  withNavigation,
  withTheme,
  connect(mapStateToProps),
  firebaseConnect([{ path: 'users' }]),
);

export default enhance(Chats);
