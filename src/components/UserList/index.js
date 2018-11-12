import React from 'react';
import { View, Text } from 'react-native';
import _map from 'lodash/map';
import Avatar from '../Avatar';


const UserList = ({ users }) => <View>{_map(users, user => <User user={user} />)}</View>;

const User = ({ user }) => (
  <View>
    <Avatar url={user.avatarUrl} />
    <Text>{user.username}</Text>
  </View>
);

export default UserList;
