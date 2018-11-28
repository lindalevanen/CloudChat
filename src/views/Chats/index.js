import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { isLoaded, isEmpty, withFirebase } from 'react-redux-firebase';

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
  <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'blue' }}>
    <ActivityIndicator size="large" />
  </View>
);

const loadedCheck = value => value === undefined || isLoaded(value);

const Chats = ({ theme, chats }) => {
  const style = styles(theme);
  return (
    <View style={style.container}>
      {!loadedCheck(chats) ? (
        <LoadingView />
      ) : isEmpty(chats) ? (
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
  withFirebase,
  connect(mapStateToProps),
)(Chats);
