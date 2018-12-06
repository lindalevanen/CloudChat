import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { setDisplayName } from 'recompose';
import { isLoaded, firebaseConnect } from 'react-redux-firebase';
import _map from 'lodash/map';
import _get from 'lodash/get';
import _filter from 'lodash/filter';

import { withTheme } from '../../components/ThemedWrapper';
import EmptyPlaceholder from '../../components/EmptyPlaceholder';
import ChatList from './ChatList';

const styles = theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.backdrop,
  },
});

const LoadingView = () => (
  <View style={{ flex: 1, justifyContent: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

const chatsWithUsers = (chats, users) => _map(chats, chat => ({
  ...chat,
  id: chat.id,
  members: _map(chat.members, user => ({
    ...user,
    ...users[user.id],
  })),
}));

const Chats = ({
  theme, chats, updatedChats, users,
}) => {
  const style = styles(theme);
  const { exists } = chats || {};
  const isEmpty = exists && Object.keys(updatedChats).length === 0;
  return (
    <View style={style.container}>
      {!(isLoaded(chats) && isLoaded(users)) ? (
        <LoadingView />
      ) : isEmpty ? (
        <EmptyPlaceholder text="No chats yet, start messaging!" />
      ) : (
        <ChatList chats={chatsWithUsers(updatedChats, users)} />
      )}
    </View>
  );
};

function selectUpdatedChats(state, userChats) {
  const { exists, ...chatMap } = userChats || {};
  return _map(chatMap, (chat, id) => ({
    ..._get(state, ['chatMetadata', id]),
    id,
  }));
}

const mapStateToProps = ({ firebase }) => ({
  updatedChats: selectUpdatedChats(firebase.data, firebase.profile.chats),
  chats: firebase.profile.chats,
  users: firebase.data.users,
  profileUid: firebase.auth.uid,
});

const enhance = compose(
  setDisplayName('Chats'),
  withNavigation,
  withTheme,
  connect(mapStateToProps),
  firebaseConnect(({ chats }) => _filter(
    [{ path: 'users' }].concat(
      _map(chats, (chat, id) => ({ path: `chatMetadata/${id}` })),
    ),
    ({ path }) => path !== 'chatMetadata/exists',
  )),
);

export default enhance(Chats);
