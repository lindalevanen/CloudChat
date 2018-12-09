import React from 'react';
import { View, Text } from 'react-native';
import { isLoaded, isEmpty, firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import _map from 'lodash/map';
import _filter from 'lodash/filter';

import TextInput from '../TextInput';
import UserList from '../UserList';
import SelectableUserList from '../UserList/SelectableUserList';
import { withTheme } from '../ThemedWrapper';

const UserListComponent = ({
  theme,
  users,
  filteredUsers,
  onSelectionDone,
  onUserPress,
}) => (onSelectionDone ? (
  <SelectableUserList
    theme={theme}
    users={users}
    filteredUsers={filteredUsers}
    onSelectionDone={onSelectionDone}
  />
) : (
  <UserList theme={theme} users={filteredUsers} onUserPress={onUserPress} />
));

const UserSearch = ({
  style,
  onSelectionDone,
  onUserPress,
  theme,
  searchString,
  setSearchString,
  users,
  filteredUsers,
}) => {
  const loading = !isLoaded(users);
  const hasUsers = !loading && !isEmpty(users);
  return (
    <View style={[{ backgroundColor: theme.backdrop }, style]}>
      <View style={{ padding: 10, backgroundColor: theme.foreground }}>
        <TextInput
          placeholder="Search users..."
          onChangeText={setSearchString}
          autoCorrect={false}
          autoCapitalize="none"
          value={searchString}
        />
      </View>
      {hasUsers ? (
        <UserListComponent
          theme={theme}
          users={users}
          filteredUsers={filteredUsers}
          onUserPress={onUserPress}
          onSelectionDone={onSelectionDone}
        />
      ) : (
        <Text />
      )}
    </View>
  );
};

const enhance = compose(
  withTheme,
  withState('searchString', 'setSearchString', ''),
  firebaseConnect([{ path: 'users', queryParams: ['orderByChild=username'] }]),
  connect((state, { searchString }) => ({
    users: _map(state.firebase.data.users, (item, key) => ({
      id: key,
      ...item,
    })),
    filteredUsers: _filter(
      _map(state.firebase.data.users, (item, key) => ({ id: key, ...item })),
      ({ username }) => searchString.length > 2
        && username.toLowerCase().indexOf(searchString.toLowerCase()) >= 0,
    ),
  })),
);
export default enhance(UserSearch);
