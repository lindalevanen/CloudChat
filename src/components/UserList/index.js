import React from 'react';
import { FlatList } from 'react-native';
import User from '../User';

const UserList = ({ theme, users }) => (
  <FlatList
    data={users}
    keyExtractor={({ key }) => key}
    renderItem={({ item }) => <User theme={theme} user={item} />}
  />
);

export default UserList;
