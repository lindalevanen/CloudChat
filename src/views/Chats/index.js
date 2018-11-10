import React from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { isLoaded, withFirebase, populate } from 'react-redux-firebase';
import { withTheme } from '../../components/ThemedWrapper';

import ChatList from './ChatList';

const styles = StyleSheet.create({
  dark: {
    backgroundColor: '#262636',
  },
});

const ChatMock = ({ chats, useDarkTheme }) => {
  console.log(`chats: ${JSON.stringify(chats, null, 2)}`);
  return (
    <ScrollView style={useDarkTheme && styles.dark}>
      {!isLoaded(isLoaded || chats) ? <Text>Loading</Text> : <ChatList chats={chats} useDarkTheme={useDarkTheme} />}
    </ScrollView>
  );
};

const mapStateToProps = state => ({
  chats: populate(state.firebase, 'profile', ['chats:chats']).chats, // populate settings are
});

export default compose(
  withTheme,
  withFirebase,
  connect(mapStateToProps),
)(ChatMock);
