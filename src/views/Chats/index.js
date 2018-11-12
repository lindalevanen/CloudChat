import React from 'react';
import { Text, ScrollView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { isLoaded, withFirebase } from 'react-redux-firebase';

import { withTheme } from '../../components/ThemedWrapper';
import ChatList from './ChatList';

const styles = StyleSheet.create({
  dark: {
    backgroundColor: '#262636',
  },
});

const Chats = ({ chats, useDarkTheme }) => (
  <ScrollView style={useDarkTheme && styles.dark}>
    {!isLoaded(chats) ? (
      <Text>Loading</Text>
    ) : (
      <ChatList chats={chats} useDarkTheme={useDarkTheme} />
    )}
  </ScrollView>
);

const mapStateToProps = state => ({
  chats: state.firebase.profile.chats,
});

export default compose(
  withTheme,
  withFirebase,
  connect(mapStateToProps),
)(Chats);
