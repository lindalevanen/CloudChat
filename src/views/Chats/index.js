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
import { isLoaded, isEmpty, firebaseConnect } from 'react-redux-firebase';

import { withTheme } from '../../components/ThemedWrapper';
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

const EmptyPlaceholder = ({ theme }) => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <Text style={{ color: theme.text2, fontSize: 20 }}>
      No chats yet, start messaging!
    </Text>
  </View>
);

const LoadingView = () => (
  <View style={{ flex: 1, justifyContent: 'center' }}>
    <ActivityIndicator size="large" />
  </View>
);

const Chats = ({ theme, chats }) => {
  const style = styles(theme);
  return (
    <View style={style.container}>
      {!isLoaded(chats) ? (
        <LoadingView />
      ) : (isEmpty(chats) || chats.exists) ? (
        <EmptyPlaceholder theme={theme} />
      ) : (
        <ScrollView style={[style.list]}>
          <ChatList chats={chats} />
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
  firebaseConnect(['chats']),
  connect(mapStateToProps),
)(Chats);
