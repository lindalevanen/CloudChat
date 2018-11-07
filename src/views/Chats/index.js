import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';

const ChatMock = ({ messages }) => (
  <View>
    {isLoaded(isLoaded) ? <Text>{JSON.stringify(messages)}</Text> : <Text>Loading</Text> }
  </View>
);

export default compose(
  firebaseConnect([
    'messages',
  ]),
  connect(state => ({
    messages: state.firebase.data.messages,
  })),
)(ChatMock);
