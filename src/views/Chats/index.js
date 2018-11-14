import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { isLoaded, withFirebase } from 'react-redux-firebase';

import { withTheme } from '../../components/ThemedWrapper';
import ChatList from './ChatList';

const chatStyles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  dark: {
    backgroundColor: '#262636',
  },
  list: {
    flex: 1,
  }
});

const Chats = ({ chats, useDarkTheme }) => (
  <View style={chatStyles.container}>
    <ScrollView style={[chatStyles.list, useDarkTheme && chatStyles.dark]}>
      {!isLoaded(chats) ? (
        <Text>Loading</Text>
      ) : (
        <ChatList chats={chats} useDarkTheme={useDarkTheme} />
      )}
    </ScrollView>
  </View>
);

const mapStateToProps = state => ({
  chats: state.firebase.profile.chats,
});

export default compose(
  withNavigation,
  withTheme,
  withFirebase,
  connect(mapStateToProps),
)(Chats);
