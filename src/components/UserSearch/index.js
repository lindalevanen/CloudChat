import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { isLoaded, isEmpty, firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose, withState } from 'recompose';
import UserList from '../UserList';
import Button from '../Button';

const UserSearch = ({
  firebase, users, text, setText,
}) => {
  const userList = !isLoaded(users)
    ? null
    : isEmpty(users)
      ? <Text>No search results</Text>
      : <UserList users={users} />;

  const asd = 'lelele';
  const queryUsers = () => {
    firebase.watchEvent('value', 'users', 'users', { queryParams: ['orderByChild=username', 'equalTo=lelele'] });
  };

  return (
    <View>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
        placeholder="Search"
        onChangeText={setText}
        value={text}
      />
      <Button title="Search" onPress={queryUsers} />

      {userList}
    </View>
  );
};

// { path: 'users', queryParams: ['orderByChild=username', `equalTo=${asd}`] }

const enhance = compose(
  firebaseConnect(),
  withState('text', 'setText'),
  connect(state => ({
    users: state.firebase.data.users,
  })),
);
export default enhance(UserSearch);
