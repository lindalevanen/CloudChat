import React from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { isLoaded, withFirebase } from 'react-redux-firebase';

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

const Chats = ({ theme, chats }) => {
  const style = styles(theme);
  const { exists, ...chatMap } = chats || { };
  const isEmpty = exists && Object.keys(chatMap).length === 0;
  return (
    <View style={style.container}>
      {!isLoaded(chats) ? (
        <LoadingView />
      ) : (isEmpty) ? (
        <EmptyPlaceholder text="No chats yet, start messaging!" />
      ) : (
        <ScrollView style={[style.list]}>
          <ChatList chats={chatMap} />
        </ScrollView>
      )}
    </View>
  );
};

const mapStateToProps = state => ({
  chats: state.firebase.profile.chats,
});

export default compose(
  withNavigation,
  withTheme,
  withFirebase,
  connect(mapStateToProps),
)(Chats);
