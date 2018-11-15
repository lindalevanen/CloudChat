import React from 'react';
import { View, Text } from 'react-native';
import { isLoaded, isEmpty, firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import _map from 'lodash/map';
import _filter from 'lodash/filter';

import TextInput from '../TextInput';
import UserList from '../UserList';
import { withTheme } from '../ThemedWrapper';

const UserSearch = ({
  theme, users, searchString, setSearchString,
}) => {
  const loading = !isLoaded(users);
  const hasUsers = !loading && !isEmpty(users);
  return (
    <View style={{ flex: 1, backgroundColor: theme.backdrop }}>
      <TextInput
        placeholder="Search users"
        onChangeText={setSearchString}
        autoCorrect={false}
        autoCapitalize="none"
        value={searchString}
      />
      {hasUsers ? (
        <UserList theme={theme} users={users} />
      ) : (
        <Text>no users</Text>
      )}
    </View>
  );
};

const enhance = compose(
  withTheme,
  withState('searchString', 'setSearchString', ''),
  firebaseConnect([{ path: 'users', queryParams: ['orderByChild=username'] }]),
  connect((state, { searchString }) => ({
    users: _filter(
      _map(state.firebase.data.users, (item, key) => ({ key, ...item })),
      ({ username }) => username.toLowerCase().indexOf(searchString.toLowerCase()) >= 0,
    ),
  })),
);
export default enhance(UserSearch);
